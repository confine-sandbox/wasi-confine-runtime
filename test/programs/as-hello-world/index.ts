import { Console } from 'as-wasi'

export function _start(): void {
  Console.log("Hello, world from AssemblyScript!")
}