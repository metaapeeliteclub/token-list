# token-list
Unified token list based on [Solscans recognized token list](https://solscan.io/tokens). Metadata storage for SPL tokens recently was changed to be partially stored on-chain rather than off-chain. This change was for the better as it is sensible; However, it added a bit of a headache for developers as all legacy tokens still remain in the old token list. To ensure you get the latest metadata, you must first attempt to fetch its metadata account from Solana. Otherwise, utilize the legacy token list accordingly. Also, this is not fullproof; Developers used to query the old token list by name, symbol, etc. to find a token. As far as we have tested there is no way to do this without a third party API at this time. Do you really want to trust an API controlled by someone else? We sure don't want to, so we created this solution to have a daily updated static token list.

## Migration
There is no migration needed when switching to this list. We use the same keys as the original token list plus some extras :)

## Update Process
This list is updated daily at exactly 00:00 by the GitHub Action located [here](./.github/workflows/update-job.yml). 

Also, you can count on a token that is currently on the list always being available. This list is append-only; meaning we will only append new and mutate data to already existing tokens.

## Structure

`Typed Interface`
```ts
{

}
```

`Example`
```json
{

}
```

## My Token isn't in the list :(
WIP: issue template that invokes workflow to automatically add token.

## License
Licensed Under [MIT](https://opensource.org/licenses/MIT).
