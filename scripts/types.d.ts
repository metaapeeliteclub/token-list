export interface TokenList {
  name: 'Solana Token List',
  logoUri: string
  keywords: string[]
  tokens: TokenListToken[]
  tags: ObjectArray<TokenListTag>
  timestamp: string
  lastUpdated: string
  version: TokenListVersion
}

export interface TokenListToken {
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: 9
  logoURI: string
  dataURI: string | null
  tags: string[]
  extensions: Record<string, string>
  createdAt: string
  isLegacy: boolean
}

export interface TokenListVersion {
  major: number
  minor: number
  patch: number
}

export interface TokenListTag {
  name: string
  description: string
}

export type ObjectArray<T> = {
  [key: string]: T
}
