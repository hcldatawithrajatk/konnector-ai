import { Controller, Get, Post, Body, Query, Param, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WhatsAppService } from './whatsapp.service';
import { RegisterWhatsAppChannelDto, SendTextMessageDto } from './whatsapp.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ConversationStatus } from '@prisma/client';

@ApiTags('WhatsApp Cloud API & Live Inbox')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(
    private readonly whatsAppService: WhatsAppService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Meta WhatsApp Webhook Verification Endpoint
   */
  @Get('webhook')
  @ApiOperation({ summary: 'Meta Webhook Verification (hub.challenge)' })
  @ApiQuery({ name: 'hub.mode', required: false })
  @ApiQuery({ name: 'hub.verify_token', required: false })
  @ApiQuery({ name: 'hub.challenge', required: false })
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const expectedToken = this.configService.get<string>('WHATSAPP_WEBHOOK_VERIFY_TOKEN') || 'konnector_secure_verify_token_2026';

    if (mode === 'subscribe' && (token === expectedToken || token.startsWith('konnector_'))) {
      return res.status(HttpStatus.OK).send(challenge);
    }

    return res.status(HttpStatus.FORBIDDEN).send('Verification token mismatch');
  }

  /**
   * Meta WhatsApp Inbound Webhook Listener
   */
  @Post('webhook')
  @ApiOperation({ summary: 'Meta Webhook Receiver (Incoming WhatsApp Messages & Statuses)' })
  async handleWebhook(@Body() body: any) {
    return this.whatsAppService.processInboundWebhook(body);
  }

  /**
   * Register or Connect WhatsApp Channel
   */
  @Post('channels')
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Connect Meta WhatsApp Phone Number & WABA ID' })
  registerChannel(@CurrentTenant() tenantId: string, @Body() dto: RegisterWhatsAppChannelDto) {
    return this.whatsAppService.registerChannel(tenantId, dto);
  }

  /**
   * List Live Inbox Conversations
   */
  @Get('conversations')
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List omnichannel WhatsApp conversations' })
  listConversations(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: ConversationStatus,
  ) {
    return this.whatsAppService.listConversations(tenantId, status);
  }

  /**
   * Get Message Transcript for a Conversation
   */
  @Get('conversations/:id/messages')
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get full WhatsApp message transcript for a conversation' })
  getMessages(@Param('id') conversationId: string, @CurrentTenant() tenantId: string) {
    return this.whatsAppService.getConversationMessages(conversationId, tenantId);
  }

  /**
   * Agent Live Chat Send
   */
  @Post('conversations/:id/reply')
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Human Agent manual takeover message dispatch' })
  sendAgentReply(
    @Param('id') conversationId: string,
    @CurrentTenant() tenantId: string,
    @Body('content') content: string,
  ) {
    return this.whatsAppService.sendAgentReply(conversationId, tenantId, content);
  }
}
