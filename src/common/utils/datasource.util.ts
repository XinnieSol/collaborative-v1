import { getConfig } from 'src/common/config/db.config';
import { SnakeCaseNamingStrategy } from 'src/common/utils/snake-case-naming-strategy.util';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import path from 'path';

export const getDefaultDataSource = () => {
    dotenv.config();

    const databaseConfig = getConfig();

    return new DataSource({
        ...databaseConfig,
        entities: [path.join(__dirname, '..', '..', '**', '*.entity.ts')],
        migrations: ['src/migrations/*.ts'],
        namingStrategy: new SnakeCaseNamingStrategy(),
    } as PostgresConnectionOptions);
};

export default getDefaultDataSource();
