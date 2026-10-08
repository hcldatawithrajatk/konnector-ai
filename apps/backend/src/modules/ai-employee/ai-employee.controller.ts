import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AiEmployeeService } from './ai-employee.service';
import { CreateAiEmployeeDto, UpdateAiEmployeeDto, CreateEscalationRuleDto } from './ai-employee.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('AI Employee Engine')
@Controller('ai-employees')
@UseGuards(AuthGuard('jwt'), TenantGuard)
@ApiBearerAuth()
export class AiEmployeeController {
  constructor(private readonly employeeService: AiEmployeeService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get ready-to-deploy industry employee templates' })
  getTemplates() {
    return this.employeeService.getAvailableTemplates();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new AI Employee' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateAiEmployeeDto) {
    return this.employeeService.createEmployee(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all AI Employees in organization' })
  list(@CurrentTenant() tenantId: string) {
    return this.employeeService.listEmployees(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AI Employee details' })
  getOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.employeeService.getEmployee(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update AI Employee configuration' })
  update(@Param('id') id: string, @CurrentTenant() tenantId: string, @Body() dto: UpdateAiEmployeeDto) {
    return this.employeeService.updateEmployee(id, tenantId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an AI Employee' })
  delete(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.employeeService.deleteEmployee(id, tenantId);
  }

  @Post(':id/escalation-rules')
  @ApiOperation({ summary: 'Add escalation rule to AI Employee' })
  addEscalationRule(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateEscalationRuleDto,
  ) {
    return this.employeeService.addEscalationRule(id, tenantId, dto);
  }
}
