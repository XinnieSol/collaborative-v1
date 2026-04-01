import { StringValueInUnits, Unit } from 'src/common/types';
import moment from 'moment';

/**
 * Get expiry time in unix timestamp
 * @param from date-time to expiry
 * @param expiresIn Expiry value
 * @returns
 */
export function getExpiryDate(from: Date, expiresIn: StringValueInUnits): Date {
    const expiryParts = String(expiresIn).split(/\d/);
    const value: number = Number(expiryParts[0]);
    const units: Unit = expiryParts.length > 1 ? (expiryParts[1] as Unit) : 's';
    return moment(from).add(units, value).toDate();
}
