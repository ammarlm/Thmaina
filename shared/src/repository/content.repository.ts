import { AbstractRepository, OrderType, PaginationResponseDto } from "@app/shared";
import { Program } from "@app/shared";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

@Injectable()
export class ContentRepository extends AbstractRepository<Program> {
    protected readonly logger = new Logger(ContentRepository.name);
    constructor(@InjectRepository(Program) repo: Repository<Program>) {
        super(repo);
        this.logger.log('ContentRepository initialized');
    }

    async findAll(
        query: string,
        orderBy: string = 'title',
        order: OrderType = 'ASC',
        page: number = 1,
        limit: number = 10
    ): Promise<PaginationResponseDto<Program>> {
        // List of allowed columns for ordering
        const allowedOrderBy = ['title', 'description', 'category', 'language', 'duration', 'publishDate', 'fileName'];

        // Validate orderBy
        if (!allowedOrderBy.includes(orderBy)) {
            throw new Error(`Invalid orderBy field: ${orderBy}`);
        }

        // Validate order
        const orderUpper = order.toUpperCase();
        if (orderUpper !== 'ASC' && orderUpper !== 'DESC') {
            throw new Error(`Invalid order: ${order}`);
        }

        const [data, total] = await this.repo.findAndCount({
            where: [
                { title: Like(`%${query}%`) },
                { description: Like(`%${query}%`) },
                { category: Like(`%${query}%`) },
            ],
            order: { [orderBy]: orderUpper },
            skip: (page - 1) * limit,
            take: limit
        });
        return {
            data,
            total,
            page,
            limit
        };
    }
}