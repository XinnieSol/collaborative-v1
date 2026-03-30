export * from './entity';
export * from './response';

const units = ['s', 'm', 'h', 'd', 'w'] as const;
export type Unit = (typeof units)[number];
export type StringValueInUnits = `${number}${Unit}`;
