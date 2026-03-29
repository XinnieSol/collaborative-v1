import * as bcrypt from 'bcrypt';
import { HASH_SALT_ROUNDS } from 'src/common/constants';

export async function hashString(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, HASH_SALT_ROUNDS);

    return hash;
}

export async function compareHashString(
    value: string,
    hash: string,
): Promise<boolean> {
    return await bcrypt.compare(value, hash);
}
