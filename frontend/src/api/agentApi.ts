const BASE_URL = 'http://localhost:3001/api'

export type AgentEvent =
  | { type: 'text'; text: string }
  | { type: 'tool'; name: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

export async function askAgent(
  message: string,
  onEvent: (event: AgentEvent) => void,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop()!          // keep incomplete last line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const event: AgentEvent = JSON.parse(line.slice(6))
      onEvent(event)
    }
  }
}
