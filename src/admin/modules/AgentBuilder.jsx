/**
 * Agent Builder Module
 * Create and manage AI agents with custom prompts
 */

import React, { useState } from 'react'

export default function AgentBuilder() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Agent Builder</h1>
        <p className="text-gray-400">
          Create and manage AI agents with custom prompts and configurations.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">🤖</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Agent Builder Module
        </h2>
        <p className="text-gray-400 mb-4">
          This module allows you to create AI agents with custom system prompts,
          training examples, and configuration flags.
        </p>
        <p className="text-sm text-gray-500">
          Full implementation coming soon after database migration.
        </p>
      </div>
    </div>
  )
}
