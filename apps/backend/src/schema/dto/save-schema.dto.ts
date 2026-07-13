import { IsNotEmpty, IsString } from 'class-validator';

export class SaveSchemaDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
