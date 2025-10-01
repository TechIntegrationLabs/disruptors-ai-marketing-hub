import { getServiceClient } from '../lib/supabase'

export const handler = async (event:any) => {
  try {
    const supabase = getServiceClient()
    const { brainId, key, value, source, confidence } = JSON.parse(event.body || '{}')
    if (!brainId || !key || (typeof value === 'undefined')) return { statusCode: 400, body: JSON.stringify({ error: { message: 'brainId, key, value required' }})}
    const { data, error } = await supabase.from('brain_facts').insert({
      brain_id: brainId, key, value, source: source || null,
      confidence: typeof confidence === 'number' ? confidence : null,
      last_verified_at: new Date().toISOString()
    }).select().single()
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ fact: data }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
