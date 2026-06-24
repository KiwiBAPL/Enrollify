import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const KEY_LENGTH = 32

function deriveKey(secret: string): Buffer {
  return scryptSync(secret, 'enrollify-ai-provider-key', KEY_LENGTH)
}

export function encryptApiKey(plaintext: string, encryptionSecret: string): string {
  const key = deriveKey(encryptionSecret)
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('base64url')}:${authTag.toString('base64url')}:${encrypted.toString('base64url')}`
}

export function decryptApiKey(ciphertext: string, encryptionSecret: string): string {
  const parts = ciphertext.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted API key format')
  }
  const [ivB64, tagB64, dataB64] = parts as [string, string, string]
  const key = deriveKey(encryptionSecret)
  const iv = Buffer.from(ivB64, 'base64url')
  const authTag = Buffer.from(tagB64, 'base64url')
  const encrypted = Buffer.from(dataB64, 'base64url')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••••••'
  const prefix = key.slice(0, 4)
  const suffix = key.slice(-4)
  return `${prefix}••••${suffix}`
}
