import { getServiceClient } from '../lib/supabase'

export const handler = async (_event:any) => {
  try {
    const supabase = getServiceClient()
    await supabase.from('telemetry_events').insert({ area: 'cron', name: 'nightly_tick', payload: { at: new Date().toISOString() } })
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message }})}
  }
}
