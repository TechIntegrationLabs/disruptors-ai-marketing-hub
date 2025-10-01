import { api } from './client'

export const Brain = {
  search: (brainId: string, q: string) =>
    api(`brain_search?brainId=${encodeURIComponent(brainId)}&q=${encodeURIComponent(q)}`),
  addFact: (payload: { brainId: string, key: string, value: any, source?: string, confidence?: number }) =>
    api('brain_add_fact', { method: 'POST', body: JSON.stringify(payload) }),
}

export const Agent = {
  invoke: (payload: { agentId: string, brainId: string, messages: any[], options?: any }) =>
    api('ai_invoke', { method: 'POST', body: JSON.stringify(payload) }),
  train: (agentId: string, background = false) =>
    api(background ? 'agent_train-background' : 'agent_train', { method: 'POST', body: JSON.stringify({ agentId }) }),
  runStatus: (runId: string) =>
    api(`agent_run_status?runId=${encodeURIComponent(runId)}`),
  feedback: (payload: { agentId: string, conversationId?: string, messageId: string, rating: number, comment?: string }) =>
    api('feedback_submit', { method: 'POST', body: JSON.stringify(payload) }),
}

export const Ingest = {
  dispatch: (payload: { brainId: string, sourceId: string }) =>
    api('ingest_dispatch-background', { method: 'POST', body: JSON.stringify(payload) }),
  status: (jobId: string) =>
    api(`ingest_status?jobId=${encodeURIComponent(jobId)}`),
}

export const Workflows = {
  run: (workflowId: string) =>
    api('workflows_run-background', { method: 'POST', body: JSON.stringify({ workflowId }) }),
  status: (runId: string) =>
    api(`workflow_status?runId=${encodeURIComponent(runId)}`),
}
