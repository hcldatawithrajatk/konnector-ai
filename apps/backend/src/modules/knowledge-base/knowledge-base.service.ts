import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AiEngineService } from '../ai-engine/ai-engine.service';
import { CreateKnowledgeBaseDto, CreateFaqDto, IngestTextDto, QueryKnowledgeDto } from './knowledge-base.dto';
import { DocStatus } from '@prisma/client';

@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  constructor(
    private prisma: PrismaService,
    private aiEngine: AiEngineService,
  ) {}

  async createKnowledgeBase(organizationId: string, dto: CreateKnowledgeBaseDto) {
    return this.prisma.knowledgeBase.create({
      data: {
        organizationId,
        name: dto.name,
        description: dto.description,
        employeeId: dto.employeeId,
      },
    });
  }

  async listKnowledgeBases(organizationId: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: {
            documents: true,
            faqs: true,
            chunks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getKnowledgeBase(id: string, organizationId: string) {
    const kb = await this.prisma.knowledgeBase.findFirst({
      where: { id, organizationId },
      include: {
        documents: true,
        faqs: true,
      },
    });

    if (!kb) {
      throw new NotFoundException('Knowledge base not found');
    }

    return kb;
  }

  async createFaq(knowledgeBaseId: string, organizationId: string, dto: CreateFaqDto) {
    const kb = await this.getKnowledgeBase(knowledgeBaseId, organizationId);

    const faq = await this.prisma.faqItem.create({
      data: {
        knowledgeBaseId: kb.id,
        organizationId,
        question: dto.question,
        answer: dto.answer,
        category: dto.category || 'General',
      },
    });

    // Also index FAQ into chunks for semantic RAG search
    const combinedText = `Question: ${dto.question}\nAnswer: ${dto.answer}`;
    const embedding = await this.aiEngine.generateEmbedding(combinedText);

    // Create a virtual document record for FAQ
    const faqDoc = await this.prisma.knowledgeDocument.create({
      data: {
        organizationId,
        knowledgeBaseId: kb.id,
        title: `FAQ: ${dto.question.substring(0, 50)}...`,
        docType: 'FAQ',
        status: DocStatus.INDEXED,
        chunksCount: 1,
        tokenCount: Math.ceil(combinedText.length / 4),
      },
    });

    await this.prisma.documentChunk.create({
      data: {
        organizationId,
        knowledgeBaseId: kb.id,
        documentId: faqDoc.id,
        chunkIndex: 0,
        content: combinedText,
        tokenCount: Math.ceil(combinedText.length / 4),
        embedding,
        metadata: { faqId: faq.id, category: dto.category },
      },
    });

    return faq;
  }

  async ingestText(knowledgeBaseId: string, organizationId: string, dto: IngestTextDto) {
    const kb = await this.getKnowledgeBase(knowledgeBaseId, organizationId);

    const chunks = this.chunkText(dto.content, 800, 100);
    const tokenCount = Math.ceil(dto.content.length / 4);

    const doc = await this.prisma.knowledgeDocument.create({
      data: {
        organizationId,
        knowledgeBaseId: kb.id,
        title: dto.title,
        docType: dto.docType || 'TXT',
        status: DocStatus.PROCESSING,
        chunksCount: chunks.length,
        tokenCount,
      },
    });

    // Process each chunk and generate vector embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const embedding = await this.aiEngine.generateEmbedding(chunkText);

      await this.prisma.documentChunk.create({
        data: {
          organizationId,
          knowledgeBaseId: kb.id,
          documentId: doc.id,
          chunkIndex: i,
          content: chunkText,
          tokenCount: Math.ceil(chunkText.length / 4),
          embedding,
          metadata: { chunkIndex: i, totalChunks: chunks.length, documentTitle: dto.title },
        },
      });
    }

    const updatedDoc = await this.prisma.knowledgeDocument.update({
      where: { id: doc.id },
      data: { status: DocStatus.INDEXED },
    });

    this.logger.log(`Indexed document "${dto.title}" into ${chunks.length} semantic chunks`);
    return updatedDoc;
  }

  /**
   * Semantic Vector Search with Cosine Similarity
   */
  async searchRelevantChunks(
    organizationId: string,
    query: string,
    knowledgeBaseId?: string,
    topK: number = 3,
  ): Promise<{ content: string; sourceTitle: string; score: number }[]> {
    const queryEmbedding = await this.aiEngine.generateEmbedding(query);

    // Retrieve all candidate chunks in the organization's knowledge base
    const chunks = await this.prisma.documentChunk.findMany({
      where: {
        organizationId,
        ...(knowledgeBaseId ? { knowledgeBaseId } : {}),
      },
      include: {
        document: {
          select: { title: true },
        },
      },
      take: 200, // Fetch top candidate pool
    });

    if (chunks.length === 0) {
      return [];
    }

    // Compute cosine similarity for each chunk
    const scoredChunks = chunks.map((chunk) => {
      const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        content: chunk.content,
        sourceTitle: chunk.document?.title || 'Knowledge Base',
        score: similarity,
      };
    });

    // Sort by highest similarity
    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, topK);
  }

  /**
   * Split document into overlapping text chunks
   */
  private chunkText(text: string, chunkSize: number = 800, overlap: number = 100): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      let end = start + chunkSize;
      if (end >= text.length) {
        chunks.push(text.substring(start).trim());
        break;
      }

      // Try breaking on natural sentence or paragraph boundaries
      const newlineIndex = text.lastIndexOf('\n', end);
      const periodIndex = text.lastIndexOf('. ', end);

      if (newlineIndex > start + chunkSize / 2) {
        end = newlineIndex;
      } else if (periodIndex > start + chunkSize / 2) {
        end = periodIndex + 1;
      }

      chunks.push(text.substring(start, end).trim());
      start = end - overlap;
    }

    return chunks.filter((c) => c.length > 20);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
