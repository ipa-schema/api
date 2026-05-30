import packageJson from './package.json'

export function version() {
  return packageJson.version
}

export * from './src/index'
