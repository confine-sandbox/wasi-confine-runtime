const fs = require('fs').promises
const util = require('util')
const AbstractConfineRuntime = require('abstract-confine-runtime')
const { WASI } = require('@wasmer/wasi')
const nodeBindings = require('@wasmer/wasi/lib/bindings/node')
const { WasmFs } = require('@wasmer/wasmfs')


module.exports = class SimpleWasmConfineRuntime extends AbstractConfineRuntime {
  constructor (sourcePath, opts) {
    super(sourcePath, opts)
    this.scriptSource = undefined
    this.instance = undefined
    this.wasiInstance = undefined
    this.wasmFs = undefined
  }

  async init () {
    this.scriptSource = await fs.readFile(this.sourcePath)

    this.wasmFs = new WasmFs()
    this.wasiInstance = new WASI({
      args: [this.sourcePath],
      env: {},
      bindings: {
        ...(nodeBindings.default || nodeBindings),
        fs: this.wasmFs.fs
      }
    })

    const memory = new WebAssembly.Memory({initial: 1})
    const wasmModule = await WebAssembly.compile(this.scriptSource)
    this.instance = await WebAssembly.instantiate(wasmModule, {
      ...this.wasiInstance.getImports(wasmModule)
    })
  }

  async run () {
    this.wasiInstance.start(this.instance)
  }

  async close () {
  }
}
