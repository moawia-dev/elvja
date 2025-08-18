import { IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AdGenDto {
  @IsString() industry!: string;
  @IsString() goal!: string;
  @IsOptional() @IsString() tone?: string;
  @IsOptional() @IsString() brandPrimary?: string;
  @IsOptional() @IsString() brandSecondary?: string;
  @IsOptional() @IsString() bannerText?: string;
  @IsBoolean() useAI!: boolean;
}

export class AudienceDto {
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() text?: string;
  @IsBoolean() useAI!: boolean;
}

export class ChannelDto {
  @IsString() name!: string;
  @IsNumber() spend!: number;
  @IsOptional() @IsNumber() clicks?: number;
  @IsOptional() @IsNumber() conversions?: number;
  @IsOptional() @IsNumber() revenue?: number;
  @IsOptional() @IsNumber() cpa?: number;
}

export class BudgetDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => ChannelDto) channels!: ChannelDto[];
  @IsOptional() @IsIn(['roas','cpa','clicks']) target?: 'roas'|'cpa'|'clicks';
  @IsBoolean() useAI!: boolean;
}
