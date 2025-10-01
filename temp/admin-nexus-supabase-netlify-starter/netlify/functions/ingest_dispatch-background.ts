import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const { brainId, sourceId } = JSON.parse(event.body || '{}')
    if (!brainId || !sourceId) return { statusCode: 400, body: JSON.stringify({ error: { message: 'brainId, sourceId required' }})}
    const { data: job } = await supabase.from('ingest_jobs').insert({ brain_id: brainId, source_id: sourceId, status: 'running', progress: 0 }).select().single()
    for (const p of [10, 35, 60, 85, 100]) { await new Promise(r=>setTimeout(r, 250)); await supabase.from('ingest_jobs').update({ progress: p }).eq('id', job.id) }
    await supabase.from('ingest_jobs').update({ status: 'success', finished_at: new Date().toISOString() }).eq('id', job.id)
    return { statusCode: 202, body: JSON.stringify({ jobId: job.id, status: 'accepted' }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
