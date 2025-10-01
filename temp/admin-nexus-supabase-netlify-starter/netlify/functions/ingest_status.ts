import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const jobId = (event.queryStringParameters || {}).jobId
    if (!jobId) return { statusCode: 400, body: JSON.stringify({ error: { message: 'jobId required' }})}
    const { data: job } = await supabase.from('ingest_jobs').select('*').eq('id', jobId).single()
    return { statusCode: 200, body: JSON.stringify({ status: job?.status, progress: job?.progress, logs: job?.logs }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
