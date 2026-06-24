export interface ChannelAdapter {
  sendMessage(recipientId: string, text: string): Promise<void>
  sendTypingOn(recipientId: string): Promise<void>
  sendTypingOff(recipientId: string): Promise<void>
  markSeen(recipientId: string): Promise<void>
}
