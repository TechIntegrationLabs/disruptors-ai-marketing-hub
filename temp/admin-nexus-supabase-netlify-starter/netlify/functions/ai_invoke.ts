import { getServiceClient } from '../lib/supabase'

export const handler = async (event: any) => {
  try {
    const supabase = getServiceClient()
    const { agentId, brainId, messages } = JSON.parse(event.body || '{}')
    if (!agentId || !brainId || !messages) return { statusCode: 400, body: JSON.stringify({ error: { message: 'agentId, brainId, messages required' }})}
    const { data: agent } = await supabase.from('agents').select('*').eq('id', agentId).single()
    const userMsg = [...messages].reverse().find((m:any)=>m.role==='user')?.content || ''
    const { data: facts } = await supabase.rpc('search_brain_facts', { brain_id: brainId, q: userMsg || '' })
    const contextBlock = (facts||[]).slice(0,8).map((f:any)=>`- ${f.key}: ${JSON.stringify(f.value)}`).join('\n')
    const reply = `[[MOCK]] Using facts:\n${contextBlock}\n---\nAssistant reply for: ${userMsg}`
    return { statusCode: 200, body: JSON.stringify({ message: { role: 'assistant', content: reply } }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
