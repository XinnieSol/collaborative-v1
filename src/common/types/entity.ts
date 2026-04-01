import { AbstractDto } from 'src/common/dto';
import { IBaseAbstractEntity } from 'src/common/interfaces';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseAbstractEntity<
    T extends AbstractDto = AbstractDto,
> implements IBaseAbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    abstract dtoClass: new (entity: BaseAbstractEntity, options?: any) => T;
    toDto?(...args: any[]): T {
        return new this.dtoClass(this, ...args);
    }
}

export abstract class AbstractEntity<
    T extends AbstractDto = AbstractDto,
> extends BaseAbstractEntity<T> {
    abstract deletedAt?: Date | null;
}
