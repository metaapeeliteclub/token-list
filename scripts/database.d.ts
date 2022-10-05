export class Store<T extends Record<any, any>> {
  protected readonly aPath: string
  protected readonly data: T
  constructor(path: string)

  public get<K extends keyof T>(key: K): T[K]
  public set<K extends keyof T>(key: K, value: T[K]): this
  public update<K extends keyof T>(key: K, update: Partial<T[K]>): this
  public delete<K extends keyof T>(key: K): this
  public keys<K extends keyof T>(): K[]
  public values<K extends keyof T>(): (T[K])[]
  public entries<K extends keyof T>(): [K, T[K]][]
  public save(): this
}