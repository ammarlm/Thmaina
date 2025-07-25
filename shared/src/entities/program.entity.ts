import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Program  extends AbstractEntity {
  @Column()
  @ApiProperty({ description: 'Title of the program' })
  title: string;

  @Column()
  @ApiProperty({ description: 'Description of the program' })
  description: string;

  @Column()
  @ApiProperty({ description: 'Category of the program (e.g., Podcast, Documentary)' })
  category: string;

  @Column()
  @ApiProperty({ description: 'Language of the program' })
  language: string;

  @Column({ type: 'float' , nullable: true})
  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @Column()
  @ApiProperty({ description: 'Publication date' })
  publishDate: Date;

  @Column({ nullable: true })
  contentUrl: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'File name of the uploaded content' })
  fileName: string;
}