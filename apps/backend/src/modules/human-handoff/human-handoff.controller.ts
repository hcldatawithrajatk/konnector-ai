import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HumanHandoffService } from './human-handoff.service';
import { TakeoverConversationDto, ReturnToAiDto } from './human-handoff.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser, UserContext } from '../../common/decorators/current-user.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Human Handoff & Escalations')
@Controller('human-handoff')
@UseGuards(AuthGuard('jwt'), TenantGuard)
@ApiBearerAuth()
export class HumanHandoffController {
  constructor(private readonly handoffService: HumanHandoffService) {}

  @Get('tickets')
  @ApiOperation({ summary: 'List open escalation tickets requiring human intervention' })
  listTickets(@CurrentTenant() tenantId: string) {
    return this.handoffService.listPendingTickets(tenantId);
  }

  @Post(':conversationId/takeover')
  @ApiOperation({ summary: 'Human Agent takes over WhatsApp chat from AI Employee' })
  takeover(
    @Param('conversationId') conversationId: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: UserContext,
    @Body() dto: TakeoverConversationDto,
  ) {
    return this.handoffService.takeoverConversation(conversationId, tenantId, user.id, dto);
  }

  @Post(':conversationId/return-to-ai')
  @ApiOperation({ summary: 'Return WhatsApp chat control back to AI Employee' })
  returnToAi(
    @Param('conversationId') conversationId: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: ReturnToAiDto,
  ) {
    return this.handoffService.returnToAi(conversationId, tenantId, dto);
  }
}
