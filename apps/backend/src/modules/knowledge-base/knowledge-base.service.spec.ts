import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBaseService } from './knowledge-base.service';
import { PrismaService } from '../database/prisma.service';
import { AiEngineService } from '../ai-engine/ai-engine.service';

describe('KnowledgeBaseService', () => {
  let service: KnowledgeBaseService;
  let prismaMock: any;
  let aiEngineMock: any;

  beforeEach(async () => {
    prismaMock = {
      knowledgeBase: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      knowledgeDocument: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      documentChunk: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    aiEngineMock = {
      generateEmbedding: jest.fn().mockImplementation((text: string) => {
        // Return deterministic mock vector
        const vec = new Array(768).fill(0.01);
        vec[0] = text.includes('fee') ? 0.9 : 0.1;
        return vec;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeBaseService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: AiEngineService, useValue: aiEngineMock },
      ],
    }).compile();

    service = module.get<KnowledgeBaseService>(KnowledgeBaseService);
  });

  describe('Cosine Similarity & Retrieval', () => {
    it('should compute exact 1.0 similarity for identical vectors', () => {
      const vecA = [0.6, 0.8, 0.0];
      const vecB = [0.6, 0.8, 0.0];

      // Access private method for thorough algorithmic verification
      const similarity = (service as any).cosineSimilarity(vecA, vecB);
      expect(similarity).toBeCloseTo(1.0, 5);
    });

    it('should compute 0.0 similarity for orthogonal vectors', () => {
      const vecA = [1.0, 0.0, 0.0];
      const vecB = [0.0, 1.0, 0.0];

      const similarity = (service as any).cosineSimilarity(vecA, vecB);
      expect(similarity).toBeCloseTo(0.0, 5);
    });

    it('should correctly rank and return highest scoring chunks for RAG context', async () => {
      const orgId = 'org-test-123';
      const query = 'What are the school fees?';

      prismaMock.documentChunk.findMany.mockResolvedValue([
        {
          id: 'chunk-1',
          content: 'The campus features an Olympic swimming pool and soccer pitch.',
          embedding: [0.1, 0.1, 0.1],
          document: { title: 'Sports Prospectus' },
        },
        {
          id: 'chunk-2',
          content: 'Tuition fees for Grade 6 are $12,500 payable in 3 installments.',
          embedding: [0.9, 0.1, 0.1],
          document: { title: 'Fee Schedule 2026' },
        },
      ]);

      const results = await service.searchRelevantChunks(orgId, query, undefined, 2);

      expect(results.length).toBe(2);
      expect(results[0].content).toContain('Tuition fees');
      expect(results[0].score).toBeGreaterThan(results[1].score);
    });
  });

  describe('Text Chunking Engine', () => {
    it('should chunk large text with configured overlap', () => {
      const longText = 'Sentence A. '.repeat(100);
      const chunks = (service as any).chunkText(longText, 200, 50);

      expect(chunks.length).toBeGreaterThan(1);
      chunks.forEach((chunk: string) => {
        expect(chunk.length).toBeLessThanOrEqual(250);
      });
    });
  });
});
