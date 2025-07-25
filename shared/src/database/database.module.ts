import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Program } from '../entities/program.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                console.log('DB_HOST',configService.get('DB_HOST'));
                console.log('DB_PORT',configService.get('DB_PORT'));
                return {
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'password'),
                    database: configService.get('DB_NAME', 'thmanyah'),
                    entities: [Program],
                    synchronize: configService.get('NODE_ENV', 'development') === 'development', // Disable in production
                };
            },
            inject: [ConfigService],
        }),
        // TypeOrmModule.forFeature([Program]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}