import { createHmac, timingSafeEqual } from 'node:crypto'

export function verifyMetaSignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  appSecret: string,
): boolean {
  if (!signatureHeader?.startsWith('sha256=')) {
    return false
  }

  const expectedHex = signatureHeader.slice('sha256='.length)
  const computedHex = createHmac('sha256', appSecret).update(rawBody).digest('hex')

  if (expectedHex.length !== computedHex.length) {
    return false
  }

  try {
    return timingSafeEqual(Buffer.from(expectedHex, 'hex'), Buffer.from(computedHex, 'hex'))
  } catch {
    return false
  }
}

export function signMetaPayload(rawBody: Buffer, appSecret: string): string {
  const hex = createHmac('sha256', appSecret).update(rawBody).digest('hex')
  return `sha256=${hex}`
}
