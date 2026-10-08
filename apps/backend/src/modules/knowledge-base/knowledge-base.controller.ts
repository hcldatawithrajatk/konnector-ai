import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { KnowledgeBaseService } from './knowledge-base.service';
import { CreateKnowledgeBaseDto, CreateFaqDto, IngestTextDto, QueryKnowledgeDto } from './knowledge-base.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Knowledge Base & RAG')
@Controller('knowledge-base')
@UseGuards(AuthGuard('jwt'), TenantGuard)
@ApiBearerAuth()
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Knowledge Base collection' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateKnowledgeBaseDto) {
    return this.kbService.createKnowledgeBase(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all Knowledge Bases for organization' })
  list(@CurrentTenant() tenantId: string) {
    return this.kbService.listKnowledgeBases(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Knowledge Base with documents and FAQs' })
  getOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.kbService.getKnowledgeBase(id, tenantId);
  }

  @Post(':id/faqs')
  @ApiOperation({ summary: 'Add a new FAQ item and auto-index into vector store' })
  addFaq(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateFaqDto,
  ) {
    return this.kbService.createFaq(id, tenantId, dto);
  }

  @Post(':id/ingest-text')
  @ApiOperation({ summary: 'Ingest raw text/policy document with automatic chunking and embedding' })
  ingestText(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: IngestTextDto,
  ) {
    return this.kbService.ingestText(id, tenantId, dto);
  }

  @Post('query')
  @ApiOperation({ summary: 'Perform semantic RAG retrieval test' })
  query(@CurrentTenant() tenantId: string, @Body() dto: QueryKnowledgeDto) {
    return this.kbService.searchRelevantChunks(tenantId, dto.query, undefined, dto.topK || 3);
  }
}
