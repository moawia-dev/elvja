import { IsHexColor, IsOptional, IsString } from 'class-validator';
export class UpsertBrandkitDto {
  @IsHexColor() primary!: string;
  @IsHexColor() secondary!: string;
  @IsOptional() @IsString() font?: string;
}
