import { getConfig } from 'src/common/config/db.config';
import { SnakeCaseNamingStrategy } from 'src/common/utils/snake-case-naming-strategy.util';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const getDefaultDataSource = () => {
    dotenv.config();

    const databaseConfig = getConfig();
    const isProd = process.env.NODE_ENV === 'production';

    return new DataSource({
        ...databaseConfig,
        entities: isProd ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
        migrations: isProd ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'],
        namingStrategy: new SnakeCaseNamingStrategy(),
    } as PostgresConnectionOptions);
};
