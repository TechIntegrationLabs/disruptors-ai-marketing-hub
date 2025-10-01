/**
 * Integrations Hub Module
 * Manage third-party service integrations
 */

import React from 'react'

export default function IntegrationsHub() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Integrations Hub</h1>
        <p className="text-gray-400">
          Connect and manage third-party services and APIs.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
        <div className="text-yellow-500 text-6xl mb-4">🔌</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Integrations Hub Module
        </h2>
        <p className="text-gray-400 mb-4">
          Connect to Google Analytics, Search Console, Meta, HubSpot, and other services.
          Manage OAuth tokens and sync data automatically.
        </p>
        <p className="text-sm text-gray-500">
          Full implementation coming soon after database migration.
        </p>
      </div>
    </div>
  )
}
