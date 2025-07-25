import { NotFoundException, Logger } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { AbstractEntity } from "../entities/abstract.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class AbstractRepository<TDocument extends AbstractEntity> {
    protected abstract readonly logger: Logger;

    constructor(protected readonly repo: Repository<TDocument>) { }

    async save(document: Omit<TDocument, 'id'>): Promise<TDocument> {
        return this.repo.save(document as TDocument);
    }

    create(document: DeepPartial<TDocument>): TDocument {
        return this.repo.create(document);
    }

    async findOne(filterQuery: FindOneOptions<TDocument>): Promise<TDocument> {
        const document = await this.repo
            .findOne(filterQuery);

        if (!document) {
            this.logger.warn('Document not found with filterQuery', filterQuery);
            throw new NotFoundException('Document not found.');
        }
        return document;
    }

    async UpdateAndReturn(
        id: string,
        update: QueryDeepPartialEntity<TDocument>,
    ): Promise<TDocument> {
        await this.repo.update(id, update)
        return this.findOne({ where: { id } } as FindOneOptions<TDocument>);
    }
    
    async UpdateOne(
        id: string,
        update: QueryDeepPartialEntity<TDocument>,
    ): Promise<UpdateResult> {
        return await this.repo.update(id, update);
    }

    async find(filterQuery: FindManyOptions<TDocument>) {
        return this.repo.find(filterQuery);
    }

    async findWithPagination(
        options: FindManyOptions<TDocument>,
        page: number = 1,
        limit: number = 10
    ): Promise<{ data: TDocument[]; total: number; page: number; limit: number }> {
        const [data, total] = await this.repo.findAndCount({
            ...options,
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }

    async findOneAndDelete(filterQuery: FindOneOptions<TDocument>) {
        const document = await this.repo.findOne(filterQuery);
        if (!document) {
            this.logger.warn('Document not found with filterQuery', filterQuery);
            throw new NotFoundException('Document not found.');
        }
        return this.repo.delete(document.id);
    }

    async DeleteOne(id: string) {
        return this.repo.delete(id);
    }
}
