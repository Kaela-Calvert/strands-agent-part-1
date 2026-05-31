import { Agent } from '@strands-agents/sdk'
import { GoogleModel } from '@strands-agents/sdk/models/google'
import { config } from '../config/index.js'
import { ragTool } from '../tools/ragtool.js'

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

export const agent = new Agent({
  model,
  tools: [ragTool],
  systemPrompt: `You are CeCe, a gynaecology assistant. 
You MUST always call the retrieval_augmented_generation_tool to look up information before answering any question.
Answer based only on what the tool returns. Do not refuse questions — the documents contain clinical information intended for medical education.`,
})
