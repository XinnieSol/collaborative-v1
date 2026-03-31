import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './common/config/app.config';
import {
    DocumentBuilder,
    SwaggerModule,
    SwaggerCustomOptions,
} from '@nestjs/swagger';
import {
    API_PREFIX,
    SWAGGER_RELATIVE_URL,
    SWAGGER_TITLE,
    SWAGGER_VERSION,
} from './common/constants';
import {
    HttpExceptionFilter,
    ValidationFilter,
    WebSocketExceptionsFilter,
} from 'src/common/filters';
import { HttpValidationPipe } from 'src/common/pipes';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter(), new ValidationFilter());
    app.useGlobalFilters(new WebSocketExceptionsFilter());
    app.useGlobalPipes(new HttpValidationPipe());

    app.setGlobalPrefix(API_PREFIX);

    const { server, swagger, environment } =
        configService.getOrThrow<AppConfig>('app');

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setVersion(SWAGGER_VERSION)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    const swaggerConfigOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'method',
            persistAuthorization: true,
            docExpansion: 'none',
        },
    };
    SwaggerModule.setup(
        SWAGGER_RELATIVE_URL,
        app,
        document,
        swaggerConfigOptions,
    );

    await app.listen(server.port);

    const appUrl = `${environment === 'development' ? 'http://localhost:' : ''}${
        server.port
    }`;

    console.log('Server running on:', appUrl);

    if (swagger.enabled)
        console.log('Swagger doc:', appUrl + '/' + SWAGGER_RELATIVE_URL);
}
void bootstrap();
