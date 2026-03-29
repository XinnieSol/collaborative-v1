import { getConfig } from 'src/common/config/db.config';
import { SnakeCaseNamingStrategy } from 'src/common/utils/snake-case-naming-strategy.util';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getDefaultDataSource = () => {
    dotenv.config();

    const databaseConfig = getConfig();

    return new DataSource({
        ...databaseConfig,
        entities: ['src/**/*.entity{.ts,.js}'],
        migrations: ['src/migrations/*{.ts,.js}'],
        namingStrategy: new SnakeCaseNamingStrategy(),
    } as PostgresConnectionOptions);
};

export default getDefaultDataSource();
