/**
 * Admin Login Component
 * Simple password-based authentication (password: "nexus")
 */

import React, { useState } from 'react'

const ADMIN_PASSWORD = 'nexus'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Success - grant access
      setTimeout(() => {
        onSuccess({ authenticated: true })
      }, 500)
    } else {
      // Wrong password
      setError('Invalid password')
      setLoading(false)
      setPassword('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain" />
      </div>

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl shadow-green-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-mono text-green-500 mb-2 animate-pulse">
              ADMIN_NEXUS
            </h1>
            <p className="text-green-400/70 text-sm font-mono">
              SECURE ACCESS REQUIRED
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded">
              <p className="text-red-400 text-sm font-mono">ERROR: {error}</p>
            </div>
          )}

          {/* Simple password form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-green-500 text-sm font-mono mb-2">
                ACCESS PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-green-500/30 text-green-400 px-4 py-2 font-mono focus:border-green-500 focus:outline-none"
                placeholder="Enter password..."
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-mono py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-green-500/20">
            <p className="text-green-500/50 text-xs font-mono text-center">
              DISRUPTORS & CO © 2025
            </p>
            <p className="text-green-500/30 text-xs font-mono text-center mt-1">
              Unauthorized access prohibited
            </p>
          </div>
        </div>
      </div>

      {/* Matrix rain CSS */}
      <style jsx>{`
        @keyframes rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        .matrix-rain::before,
        .matrix-rain::after {
          content: '01010101010101010101';
          position: absolute;
          top: -100%;
          left: 0;
          right: 0;
          color: #00ff00;
          font-family: monospace;
          font-size: 20px;
          line-height: 20px;
          animation: rain 3s linear infinite;
          white-space: pre;
          word-wrap: break-word;
        }

        .matrix-rain::after {
          animation-delay: 1.5s;
          left: 50%;
        }
      `}</style>
    </div>
  )
}
