import { tool } from '@strands-agents/sdk'
import { z } from 'zod'
import getCollection from '../../chroma-collection.js'

async function getContext(query: string): Promise<string> {
  const collection = await getCollection('ragdocs')
  const results = await collection.query({ queryTexts: [query], nResults: 5 })
  return results.documents[0].filter(Boolean).join('\n\n')
}

export const ragTool = tool({
  name: 'retrieval_augmented_generation_tool',
  description: 'Get specific info related to gynaecology from the ingested documents',
  inputSchema: z.object({
    message: z.string().describe('A question related to gynaecology that can be answered using the ingested documents'),
  }),
  callback: async (input) => {
    return await getContext(input.message)
  },
})
