import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const { agentId, conversationId, messageId, rating, comment } = JSON.parse(event.body || '{}')
    if (!agentId || !messageId || typeof rating !== 'number') return { statusCode: 400, body: JSON.stringify({ error: { message: 'agentId, messageId, rating required' }})}
    const { data, error } = await supabase.from('agent_feedback').insert({
      agent_id: agentId, conversation_id: conversationId || null, message_id: messageId, rating, comment: comment || null
    }).select().single()
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ feedback: data }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
