import { Router, Request, Response } from 'express'
import { agent } from '../agent/index.js'

const router = Router()

router.post('/ask', async (req: Request, res: Response) => {
  const { message } = req.body
  if (!message) {
    res.status(400).json({ error: 'Message is required' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const send = (payload: object) => res.write(`data: ${JSON.stringify(payload)}\n\n`)

  try {
    for await (const event of agent.stream(message)) {
      switch (event.type) {
        case 'modelStreamUpdateEvent':
          if (
            event.event.type === 'modelContentBlockDeltaEvent' &&
            event.event.delta.type === 'textDelta'
          ) {
            send({ type: 'text', text: event.event.delta.text })
          }
          break
        case 'beforeToolCallEvent':
          send({ type: 'tool', name: event.toolUse.name })
          break
        case 'agentResultEvent':
          send({ type: 'done' })
          break
      }
    }
  } catch (err) {
    console.error(err)
    send({ type: 'error', message: 'Agent failed' })
  } finally {
    res.end()
  }
})

export default router
