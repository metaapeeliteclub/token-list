export function startStopwatch()
export function stopStopwatch()
export function pad(input: number, max: number): string
export function timeout(ms: number): Promise<void>
export function asyncForEach<T extends ArrayLike>(items: T, cb: (item: T[number], i: number) => Promise<unknown>)
