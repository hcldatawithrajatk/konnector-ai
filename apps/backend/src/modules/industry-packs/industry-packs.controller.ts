import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IndustryPacksService } from './industry-packs.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Industry Solution Packs')
@Controller('industry-packs')
export class IndustryPacksController {
  constructor(private readonly packsService: IndustryPacksService) {}

  @Get()
  @ApiOperation({ summary: 'List all pre-built industry solution packs (Schools, Healthcare, Real Estate)' })
  list() {
    return this.packsService.getAvailablePacks();
  }

  @Post(':packId/install')
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'One-click install industry pack into tenant workspace' })
  install(@Param('packId') packId: string, @CurrentTenant() tenantId: string) {
    return this.packsService.installIndustryPack(tenantId, packId);
  }
}
