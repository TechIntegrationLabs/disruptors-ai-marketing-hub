/**
 * Admin Login Component
 * Matrix-style authentication interface matching existing secret admin aesthetic
 */

import React, { useState } from 'react'
import { loginAdmin, requestAdminRole } from '../../api/auth'

export default function AdminLogin({ onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'secret'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginAdmin(email, password)
      onSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSecretAccess = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await requestAdminRole(secretKey)
      onSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 font-mono text-sm transition-colors ${
                mode === 'login'
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-green-500 border border-green-500/30'
              }`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setMode('secret')}
              className={`flex-1 py-2 px-4 font-mono text-sm transition-colors ${
                mode === 'secret'
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-green-500 border border-green-500/30'
              }`}
            >
              SECRET_KEY
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded">
              <p className="text-red-400 text-sm font-mono">ERROR: {error}</p>
            </div>
          )}

          {/* Login form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-green-500/30 text-green-400 px-4 py-2 font-mono focus:border-green-500 focus:outline-none"
                  placeholder="admin@disruptors.co"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-green-500/30 text-green-400 px-4 py-2 font-mono focus:border-green-500 focus:outline-none"
                  placeholder="••••••••"
                  required
                  disabled={loading}
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
          )}

          {/* Secret key form */}
          {mode === 'secret' && (
            <form onSubmit={handleSecretAccess} className="space-y-4">
              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">
                  SECRET_ACCESS_KEY
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-black border border-green-500/30 text-green-400 px-4 py-2 font-mono focus:border-green-500 focus:outline-none"
                  placeholder="Enter secret key..."
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-mono py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'VERIFYING...' : 'GRANT ACCESS'}
              </button>

              <p className="text-green-500/50 text-xs font-mono text-center mt-4">
                Requires admin authorization key
              </p>
            </form>
          )}

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
