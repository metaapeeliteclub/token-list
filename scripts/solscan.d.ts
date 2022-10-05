import { Dispatcher } from "undici"

export interface SolScanSftResponseBody {
  succcess: boolean
  data: {
    tokens: SolScanToken[]
    total: number
  }
}

export interface SolScanToken {
  tag?: string[]
  tokenName?: string
  tokenSymbol?: string
  twitter?: string
  website?: string
  createdAt: string
  decimals?: number
  extensions?: Record<string, string>
  icon?: string
  mintAddress: string
}

export interface SolScanOptions {
  retriesBeforeReject: number,
  retryTimeoutSeconds: number,
  baseUrl: string
}

export class SolScan {
  public options: SolScanOptions
  constructor(options?: Partial<SolScanOptions>)

  public getSfts(offset: number, limit?: number): Promise<SolScanSftResponseBody>
}

export class SearchParams {
  protected params: Map<string, string | number>
  constructor()

  public set(a: string, b: string | number): this
  public toString(): string
}