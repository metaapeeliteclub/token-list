// !Imports
const core = require('@actions/core')
const { SolScan } = require('./solscan')
const { Store } = require('./database')
const { startStopwatch, stopStopwatch, timeout, asyncForEach, pad } = require('./util')
const fs = require('fs')
const path = require('path')
const { Connection, PublicKey } = require('@solana/web3.js')
const { Metaplex } = require('@metaplex-foundation/js')
const { Result } = require('@sapphire/result')

// !Constants
const rpcUrl = 'https://ssc-dao.genesysgo.net/'
const pathToListFile = '../token-list.json'
// No need for a solscan throttle when metaplex throttles it through legacy check
const ssThrottle = 0
// From our understanding genesysgo is 200 rps so this threshold should be fine
const solThrottle = 180
const listFile = path.resolve(__dirname, pathToListFile)

// !Database
/**
 * @type {Store<Partial<import('./types').TokenList>>}
 */
const db = new Store(listFile)

// !Fill out default stuff in file
db.update('name', 'Solana Token List')
db.update('logoUri', 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png')
db.update('keywords', ['solana', 'spl'])
db.update('tags', {
  'stablecoin': {
    name: 'stablecoin',
    description: 'Tokens that are fixed to an external asset, e.g. the US dollar',
  },
  'ethereum': {
    name: 'ethereum',
    description: 'Asset bridged from ethereum',
  },
  'lp-token': {
    name: 'lp-token',
    description: 'Asset representing liquidity provider token',
  },
  'wrapped-sollet': {
    name: 'wrapped-sollet',
    description: 'Asset wrapped using sollet bridge',
  },
  'wrapped': {
    name: 'wrapped',
    description: 'Asset wrapped using wormhole bridge',
  },
  'leveraged': {
    name: 'leveraged',
    description: 'Leveraged asset',
  },
  'bull': {
    name: 'bull',
    description: 'Leveraged Bull asset',
  },
  'bear': {
    name: 'bear',
    description: 'Leveraged Bear asset',
  },
  'nft': {
    name: 'nft',
    description: 'Non-fungible token',
  },
  'security-token': {
    name: 'security-token',
    description: 'Tokens that are used to gain access to an electronically restricted resource',
  },
  'utility-token': {
    name: 'utility-token',
    description: 'Tokens that are designed to be spent within a certain blockchain ecosystem e.g. most of the SPL-Tokens',
  },
  'tokenized-stock': {
    name: 'tokenized-stock',
    description: 'Tokenized stocks are tokenized derivatives that represent traditional securities, particularly shares in publicly firms traded on regulated exchanges',
  },
})
db.update('timestamp', new Date().toISOString())
db.update('lastUpdated', new Date().toISOString())
db.update('version', {
  major: 0,
  minor: 4,
  patch: 0,
})
db.save()

// !RPC
const solana = new Connection(rpcUrl)
const metaplex = new Metaplex(solana)
const solscan = new SolScan()

// !Main Method
async function main() {
  // // Start log stopwatch
  // startStopwatch()

  // // Make an inital request for total token count.
  // const data = await solscan.getSfts(0, 0)

  // // If request is not "succcess" then that is probably not good.
  // if (!data.succcess)
  //   throw new Error('Program Failed : Initial request success status negated.')
  // // Assign total tokens to variable
  // const tokenAmt = data.data.total

  // // Push current data into map to ensure we only append and mutate
  // /**
  //  * @type {Map<string, import('./types').TokenListToken>}
  //  */
  // const tokens = new Map(
  //   (db.get('tokens') ?? [])
  //     .map((i) => ([i.address, i]))
  // )

  // // While tokens collected len is less than total amount we keep requesting.
  // while (tokens.size < tokenAmt) {
  //   // Log current fetch progress.
  //   const padding = pad(tokens.size, tokenAmt)
  //   console.log(`Fetch Progress | ${padding}${tokens.size}/${tokenAmt}`)
  //              //NeLegacy Check 
  //   // Make request using current collected tokens as offset.
  //   const res = await solscan.getSfts(tokens.size)

  //   // Once again if not "succcess" assuming not good.
  //   if (!data.succcess)
  //     throw new Error(`Program Failed : request offset ${
  //       tokens.size
  //     } success status negated.`)

  //   // Push tokens to total collection.
  //   await asyncForEach(res.data.tokens, async (v, i) => {
  //     const padding = pad(i, res.data.tokens.length)
  //     // If this data is not present we have no reason to store it
  //     if (!v.decimals && !v.tokenName && !v.tokenSymbol && !v.icon)
  //       return console.log(`NeLegacy Check | ${padding}${i}/${res.data.tokens.length} | No Metadata. Skipping.`)
      
  //     // We only want to do the legacy check if the token is still legacy.
  //     // we dont want a situation where the metaplex endpoint is down on the
  //     // run so it starts marking non legacy tokens as legacy.
  //     const og = tokens.get(v.mintAddress) ?? { dataURI: null, isLegacy: true }
  //     if (og.isLegacy) {
  //       // Check if it is legacy by attempting to request metaplex data url.
  //       const result = await Result.fromAsync(metaplex.nfts().findByMint({
  //         'mintAddress': new PublicKey(v.mintAddress)
  //       }).run())
  //       if (result.isOk()) og.dataURI = result.unwrap().uri
  //       og.isLegacy = og.dataURI ? false : true
  //     }

  //     console.log(`NeLegacy Check | ${padding}${i}/${res.data.tokens.length} | ${og.isLegacy}`)

  //     tokens.set(v.mintAddress, {
  //       chainId: 101,
  //       address: v.mintAddress,
  //       symbol: v.tokenSymbol,
  //       name: v.tokenName,
  //       decimals: v.decimals,
  //       logoURI: v.icon,
  //       dataURI: og.dataURI,
  //       tags: v.tag ?? [],
  //       extensions: v.extensions ?? {},
  //       createdAt: v.createdAt,
  //       isLegacy: og.isLegacy,
  //     })

  //     if (solThrottle > 0)
  //       await timeout(solThrottle)
  //   })

  //   // If solscan throttle is more than 0 then wait until next request
  //   if (ssThrottle > 0)
  //     await timeout(ssThrottle)
  // }

  // db.set('tokens', Array.from(tokens.values()))
  // console.log(`Program Finish | Updated ${tokens.size} Tokens | Saving DB`)
  // db.save()
}

// !Invoke
main()
  .catch((err) => {
    console.error(err)
    core.setFailed(String(err))
  })
  .finally(() => {
    // stopStopwatch()
    process.exit(0)
  })
