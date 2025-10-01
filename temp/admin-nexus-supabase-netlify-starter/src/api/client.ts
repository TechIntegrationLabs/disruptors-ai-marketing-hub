export async function api(path: string, init?: RequestInit) {
  const res = await fetch(`/api/${path}`, {
    method: init?.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) },
    body: init?.body
  })
  if (!res.ok) {
    const text = await res.text().catch(()=> '')
    throw new Error(`API ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}
