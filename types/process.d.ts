// Minimal ambient declaration to satisfy TypeScript when Node types are unavailable
// This avoids "Cannot find name 'process'" errors in client-shared modules.
// If @types/node is installed (recommended), this file is harmless.
declare const process: {
  env: { [key: string]: string | undefined }
}
