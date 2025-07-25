import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'Unique identifier' })
    id: string;
}