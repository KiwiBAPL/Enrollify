import type { Env } from '../config/env.js'
import type { Logger } from '../lib/logger.js'
import type { ChannelAdapter } from './ChannelAdapter.js'

const GRAPH_API = 'https://graph.facebook.com/v21.0/me/messages'

export class MessengerChannelAdapter implements ChannelAdapter {
  constructor(
    private readonly env: Env,
    private readonly logger: Logger,
  ) {}

  private async postSenderAction(
    recipientId: string,
    senderAction: 'typing_on' | 'typing_off' | 'mark_seen',
  ): Promise<void> {
    const body = {
      recipient: { id: recipientId },
      sender_action: senderAction,
    }
    await this.sendToGraph(body)
  }

  async sendMessage(recipientId: string, text: string): Promise<void> {
    const body = {
      recipient: { id: recipientId },
      message: { text },
    }
    await this.sendToGraph(body)
  }

  async sendTypingOn(recipientId: string): Promise<void> {
    await this.postSenderAction(recipientId, 'typing_on')
  }

  async sendTypingOff(recipientId: string): Promise<void> {
    await this.postSenderAction(recipientId, 'typing_off')
  }

  async markSeen(recipientId: string): Promise<void> {
    await this.postSenderAction(recipientId, 'mark_seen')
  }

  private async sendToGraph(body: Record<string, unknown>): Promise<void> {
    const url = `${GRAPH_API}?access_token=${encodeURIComponent(this.env.FB_PAGE_ACCESS_TOKEN)}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      this.logger.error({ status: response.status, errorText }, 'Messenger Send API error')
      throw new Error(`Messenger Send API failed: ${response.status}`)
    }
  }
}
