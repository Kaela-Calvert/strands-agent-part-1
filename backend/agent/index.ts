import { Agent } from '@strands-agents/sdk'
import { GoogleModel } from '@strands-agents/sdk/models/google'
import { config } from '../config/index.js'

const model = new GoogleModel({
  apiKey: config.geminiApiKey,
  modelId: config.model.id,
  params: {
    temperature: config.model.temperature,
    maxOutputTokens: config.model.maxOutputTokens,
    topP: config.model.topP,
    topK: config.model.topK,
  },
})

export const agent = new Agent({ model })
