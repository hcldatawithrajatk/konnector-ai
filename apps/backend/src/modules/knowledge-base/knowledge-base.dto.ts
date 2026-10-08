import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateKnowledgeBaseDto {
  @ApiProperty({ example: 'Admissions & Policies 2026' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Contains curriculum guides, tuition schedules, and campus policies' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employeeId?: string;
}

export class CreateFaqDto {
  @ApiProperty({ example: 'What are the school hours?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 'School operates from 8:15 AM to 3:15 PM Monday through Friday.' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiPropertyOptional({ example: 'General' })
  @IsString()
  @IsOptional()
  category?: string;
}

export class IngestTextDto {
  @ApiProperty({ example: 'Tuition Fee Structure 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Annual tuition for Grade 1-5 is $12,500. For Grade 6-10 it is $15,000...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'TXT' })
  @IsString()
  @IsOptional()
  docType?: string;
}

export class IngestUrlDto {
  @ApiProperty({ example: 'https://greenfieldacademy.example.com/admissions' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'GreenField Admissions Webpage' })
  @IsString()
  @IsOptional()
  title?: string;
}

export class QueryKnowledgeDto {
  @ApiProperty({ example: 'How much does Grade 6 tuition cost?' })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({ example: 4, default: 3 })
  @IsOptional()
  topK?: number;
}
