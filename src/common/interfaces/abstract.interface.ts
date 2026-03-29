import { AbstractDto } from 'src/common/dto/abstract.dto';

export interface IBaseAbstractEntity<T extends AbstractDto = AbstractDto> {
    id: string;

    createdAt: Date;

    updatedAt: Date;

    dtoClass: typeof AbstractDto;

    toDto?(): T;
}

export interface IAbstractEntity<
    K extends AbstractDto = AbstractDto,
> extends IBaseAbstractEntity<K> {
    deletedAt?: Date;
}
