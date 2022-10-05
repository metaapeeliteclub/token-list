const { request, Dispatcher } = require('undici')
const { pad, timeout } = require('./util')

class SearchParams {
  constructor() {
    /**
     * @private
     */
    this.params = new Map()
  }

  /**
   * @param {string} a key
   * @param {string | number} b value
   */
  set(a, b) {
    this.params.set(a, b)
    return this
  }

  toString() {
    return Array.from(
      this.params.entries()
    ).map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    ).join('&')
  }
}

// Small SolScan Api Wrapper
class SolScan {
  // Base Options
  options = {
    retriesBeforeReject: 10,
    retryTimeoutSeconds: 10,
    baseUrl: 'https://api.solscan.io'
  }

  // Constructor
  constructor(options) {
    this.options = { ...this.options, ...options }
  }
  
  /**
   * Create a new get request to solscan api.
   * @param {string} path url partial (/foo/bar)
   * @param {SearchParams | undefined} query option seach parameters (?foo=bar&bar=baz)
   * @returns {Promise<Dispatcher.ResponseData>}
   */
  async get(path, query = undefined) {
    // Counter for request attempts
    let tries = 0

    // Function that can be called recurively for multiple request attempts.
    const req = async () => {
      // If tries are more or equal to max tried throw an error to break recursion loop.
      if (tries >= this.options.retriesBeforeReject) 
        throw new Error('Attempt limit reached!')

      // Increment the tries by 1
      tries++

      // Calculated the padding needed to keep error logs organized
      const padding = pad(tries, this.options.retriesBeforeReject)

      // We want to catch possible errors so we can recurse a new attempt if needed.
      try {

        // Initialize a request using undici
        const res = await request(`${this.options.baseUrl}${path}${
          query ? `?${query.toString()}` : ''
        }`, { method: 'GET' })

        // If the request returns 200 status return ResponseData
        if (res.statusCode === 200) return res

        // Otherwise log as a request failed.
        console.error(`Request Failed | GET ${path} | Attempt ${tries}${padding} | code : ${res.statusCode}`)

        // If there is a retry timeout of more than 0 timeout.
        if (this.options.retryTimeoutSeconds > 0)
          await timeout(this.options.retryTimeoutSeconds * 1000)
        
        // Recurse a new attempt
        return req()
      } catch (error) {
        // If an actual error occured with undici log as failed request
        console.error(`Request Failed | GET ${path} | Attempt ${tries}${padding} |`, error)

        // If there is a retry timeout of more than 0 timeout.
        if (this.options.retryTimeoutSeconds > 0)
          await timeout(this.options.retryTimeoutSeconds * 1000)

        // Recurse a new attempt
        return req()
      }
    }

    // Invoke the recursive requester
    return req()
  }

  /**
   * Get method wrapper for collecting and parsing sfts.
   * @param {number} offset Weirdchamp solscan pagination
   * @param {number} limit Result limit
   * @returns 
   */
  async getSfts(offset, limit = 50) {
    // Invoke a request to /tokens with spec'd search params.
    const res = await this.get(
      '/tokens',
      new SearchParams()
        .set('offset', offset)
        .set('limit', limit)
        .set('sortby', 'alphaVolume')
        .set('sorttype', 'desc'),
    )

    // If the repsonse content-type is json then we can return the parsed json.
    if (res.headers['content-type'].toLowerCase().startsWith('application/json'))
      return res.body.json()

    // If the content-type is not JSON something is definitely wrong.
    throw new Error('Invalid : response body not JSON')
  }
}

module.exports = {
  SolScan,
  SearchParams,
}
