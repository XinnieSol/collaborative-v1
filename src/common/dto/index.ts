import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export * from './abstract.dto';

export function WrapperDto<T>(classRef: new () => T) {
    class Wrapper {
        @ValidateNested()
        @Type(() => classRef)
        data: T;
    }
    return Wrapper;
}
