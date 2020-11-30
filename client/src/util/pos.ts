export const pos = (time: number): number => (time - 8) / 7.5;

export const style = (pos: number): string => `calc(${pos} * var(--height))`;
