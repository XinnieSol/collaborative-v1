export * from './snake-case-naming-strategy.util';
export * from './datasource.util';
export * from './validation.util';
export * from './date.util';
export * from './socket.util';

export function randomNumeric(length: number) {
    let result = '';
    const nos = `${Math.floor(new Date().getTime() / 1000)}12345678900`;
    const nosLength = nos.length;
    let i = 0;
    while (i < length || result.length < length) {
        result += nos.charAt(Math.floor(Math.random() * nosLength));
        result = result.trim();
        i++;
    }
    return result;
}
