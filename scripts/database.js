const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')
const { dirname, resolve } = require('path')

class Store {
  /**
   * @private
   */
  aPath
  /**
   * @private
   */
  data
  constructor(path) {
    this.aPath = resolve(__dirname, path)

    if (!existsSync(this.aPath)) {
      const directory = dirname(this.aPath)
      mkdirSync(directory, { recursive: true })
      writeFileSync(this.aPath, JSON.stringify({}))
    }

    this.data = JSON.parse(readFileSync(this.aPath, 'utf8'))
  }

  get(key) {
    return this.data[key]
  }

  set(key, value) {
    this.data[key] = value
    return this
  }

  update(key, update) {
    if (typeof update === 'object')
      this.data[key] = { ...this.data[key], ...update }
    else this.data[key] = update
    return this
  }

  delete(key) {
    delete this.data[key]
    return this
  }

  keys() {
    return Object.keys(this.data)
  }

  values() {
    return Object.values(this.data)
  }

  entries() {
    return Object.entries(this.data)
  }

  save() {
    writeFileSync(this.aPath, JSON.stringify(this.data))
    return this
  }
}

module.exports = {
  Store
}