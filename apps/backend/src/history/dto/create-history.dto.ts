import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  url: string;

  @IsString()
  method: string;

  @IsOptional()
  @IsInt()
  statusCode?: number | null;

  @IsInt()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsInt()
  requestSize?: number | null;

  @IsOptional()
  @IsInt()
  responseSize?: number | null;

  @IsOptional()
  @IsString()
  errorDetails?: string | null;
}
