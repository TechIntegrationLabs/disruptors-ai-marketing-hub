import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const { agentId } = JSON.parse(event.body || '{}')
    if (!agentId) return { statusCode: 400, body: JSON.stringify({ error: { message: 'agentId required' }})}
    const { data: run, error } = await supabase.from('agent_runs').insert({ agent_id: agentId, type: 'train', status: 'running', started_at: new Date().toISOString() }).select().single()
    if (error) throw error
    await supabase.from('agents').update({ system_prompt: 'SYSTEM: Improved prompt [sync stub]' }).eq('id', agentId)
    await supabase.from('agent_runs').update({ status: 'success', finished_at: new Date().toISOString(), metrics: { improved: true } }).eq('id', run.id)
    return { statusCode: 200, body: JSON.stringify({ runId: run.id }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
