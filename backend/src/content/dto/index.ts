import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsUrl, IsUUID } from 'class-validator';
import { ContentType, ContentStatus, Platform } from '../../entities/content.entity';

export class CreateContentDto {
  @IsUUID()
  creatorId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ContentType)
  contentType: ContentType;

  @IsEnum(Platform)
  platform: Platform;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsUrl()
  externalUrl?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsUrl()
  contentUrl?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  categories?: string[];
}

export class UpdateContentStatsDto {
  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsNumber()
  likes?: number;

  @IsOptional()
  @IsNumber()
  shares?: number;

  @IsOptional()
  @IsNumber()
  comments?: number;
}