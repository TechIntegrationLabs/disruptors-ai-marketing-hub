import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const { workflowId } = JSON.parse(event.body || '{}')
    if (!workflowId) return { statusCode: 400, body: JSON.stringify({ error: { message: 'workflowId required' }})}
    const { data: run } = await supabase.from('workflow_runs').insert({ workflow_id: workflowId, status: 'running', progress: 0, started_at: new Date().toISOString() }).select().single()
    for (const p of [25, 50, 75, 100]) { await new Promise(r=>setTimeout(r, 200)); await supabase.from('workflow_runs').update({ progress: p }).eq('id', run.id) }
    await supabase.from('workflow_runs').update({ status: 'success', finished_at: new Date().toISOString(), metrics: { ok: true } }).eq('id', run.id)
    return { statusCode: 202, body: JSON.stringify({ runId: run.id, status: 'accepted' }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
