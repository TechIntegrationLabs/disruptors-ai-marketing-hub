import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const runId = (event.queryStringParameters || {}).runId
    if (!runId) return { statusCode: 400, body: JSON.stringify({ error: { message: 'runId required' }})}
    const { data: run } = await supabase.from('workflow_runs').select('*').eq('id', runId).single()
    return { statusCode: 200, body: JSON.stringify({ status: run?.status, progress: run?.progress, logs: run?.logs, metrics: run?.metrics }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
