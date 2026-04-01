import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/types';

export class AbstractDto {
    @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(entity: AbstractEntity) {
        this.id = entity.id;
    }
}
