import { IsString, IsOptional, IsArray, IsObject, IsUUID } from 'class-validator';
import { CreatorTier, CreatorStatus } from '../../entities/creator.entity';

export class CreateCreatorDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsArray()
  contentCategories?: string[];

  @IsOptional()
  @IsObject()
  socialMediaLinks?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
  };
}

export class UpdateCreatorDto {
  @IsOptional()
  @IsArray()
  contentCategories?: string[];

  @IsOptional()
  @IsObject()
  socialMediaLinks?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
  };

  @IsOptional()
  @IsObject()
  analytics?: Record<string, any>;
}

export class UpdateCreatorStatusDto {
  @IsString()
  status: CreatorStatus;
}

export class UpdateCreatorTierDto {
  @IsString()
  tier: CreatorTier;
}