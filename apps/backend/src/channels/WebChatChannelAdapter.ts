import type { ChannelAdapter } from './ChannelAdapter.js'

/** No-op adapter for synchronous web chat (reply returned via HTTP, not pushed). */
export class WebChatChannelAdapter implements ChannelAdapter {
  async sendMessage(_recipientId: string, _text: string): Promise<void> {}

  async sendTypingOn(_recipientId: string): Promise<void> {}

  async sendTypingOff(_recipientId: string): Promise<void> {}

  async markSeen(_recipientId: string): Promise<void> {}
}
