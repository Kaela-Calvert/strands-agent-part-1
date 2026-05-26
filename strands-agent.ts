import express from 'express'
import cors from 'cors'
import { config } from './backend/config/index.js'
import agentRouter from './backend/routes/agent.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', agentRouter)

app.listen(config.port, () =>
  console.log(`Agent server running on http://localhost:${config.port}`),
)
