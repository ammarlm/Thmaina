import { IsString, IsInt, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProgramLanguage } from '@app/shared';

export class CreateProgramDto {
    @IsString()
    @ApiProperty({ description: 'Title of the program' })
    title: string;

    @IsString()
    @ApiProperty({ description: 'Description of the program' })
    description: string;

    @IsString()
    @ApiProperty({ description: 'Category of the program' })
    category: string;

    @IsString()
    @ApiProperty({ description: 'Language of the program' })
    language: ProgramLanguage;

    @IsOptional()
    @ApiProperty({ description: 'Uploaded file', type: 'string', format: 'binary' })
    file?: string;
}


export class UpdateProgramDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Title of the program', required: false })
    title?: string;
  
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Description of the program', required: false })
    description?: string;
  
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Category of the program', required: false })
    category?: string;
  
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Language of the program', required: false })
    language?: string;
  
  
    @IsOptional()
    @ApiProperty({ description: 'Uploaded file', type: 'string', format: 'binary', required: false })
    file?: any;
  }