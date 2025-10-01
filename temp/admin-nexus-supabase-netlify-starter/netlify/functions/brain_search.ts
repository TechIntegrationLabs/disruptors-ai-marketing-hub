import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const { brainId, q } = event.queryStringParameters || {}
    if (!brainId) return { statusCode: 400, body: JSON.stringify({ error: { message: 'brainId required' }})}
    const { data } = await supabase.rpc('search_brain_facts', { brain_id: brainId, q: q || '' })
    return { statusCode: 200, body: JSON.stringify({ results: data || [] }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
