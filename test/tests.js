const ava = require('ava')
const {join} = require('path')
const WasiConfineRuntime = require('../index.js')

ava('rust-hello-world', async t => {
  const runtime = new WasiConfineRuntime(join(__dirname, 'programs', 'rust-hello-world.wasm'))
  await runtime.init()
  await runtime.run()
  console.log(await runtime.wasmFs.getStdOut())
  t.pass()
})

ava('as-hello-world', async t => {
  const runtime = new WasiConfineRuntime(join(__dirname, 'programs', 'as-hello-world.wasm'))
  await runtime.init()
  await runtime.run()
  console.log(await runtime.wasmFs.getStdOut())
  t.pass()
})