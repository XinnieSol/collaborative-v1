import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from './page.dto';

export class PageOptionsDto {
    @ApiPropertyOptional({ enum: Order, default: Order.ASC })
    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.ASC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 1000,
        default: 20,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(1000)
    @IsOptional()
    readonly pageSize: number = 20;

    @ApiProperty({
        example: 'Hello',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly searchTerm?: string;

    @Exclude()
    get skip(): number {
        return (this.page - 1) * this.pageSize;
    }
}
