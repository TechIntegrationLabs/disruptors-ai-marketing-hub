/**
 * Admin Shell Component
 * Main container with navigation and layout for all admin modules
 */

import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { logoutAdmin } from '../api/auth'
import {
  LayoutDashboard,
  FileText,
  Users,
  Image,
  Brain,
  Palette,
  Bot,
  Workflow,
  Plug,
  Activity,
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Overview', href: '/admin/secret/overview', icon: LayoutDashboard },
    { name: 'Content', href: '/admin/secret/content', icon: FileText },
    { name: 'Team', href: '/admin/secret/team', icon: Users },
    { name: 'Media', href: '/admin/secret/media', icon: Image },
    { name: 'Business Brain', href: '/admin/secret/business-brain', icon: Brain },
    { name: 'Brand DNA', href: '/admin/secret/brand-dna', icon: Palette },
    { name: 'Agents', href: '/admin/secret/agents', icon: Bot },
    { name: 'Workflows', href: '/admin/secret/workflows', icon: Workflow },
    { name: 'Integrations', href: '/admin/secret/integrations', icon: Plug },
    { name: 'Telemetry', href: '/admin/secret/telemetry', icon: Activity },
  ]

  const handleLogout = async () => {
    try {
      await logoutAdmin()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-900 border-b border-green-500/30">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-green-400">
              ADMIN_NEXUS
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-500/50 hover:bg-red-900/50 transition-colors"
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 z-40 bg-gray-900 border-r border-green-500/30 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '240px' }}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? 'bg-green-500 text-black'
                      : 'text-green-500 hover:bg-green-500/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-500/30">
            <div className="text-xs text-green-500/50 space-y-1">
              <div>v1.0.0</div>
              <div>Disruptors & Co</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex-1 min-h-screen transition-all duration-300 ${
            sidebarOpen ? 'ml-[240px]' : 'ml-0'
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Matrix rain effect (optional) */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="matrix-bg"></div>
      </div>

      <style jsx>{`
        .matrix-bg::before {
          content: '01010101010101010101010101010101010101010101010101010101010101010101010101010101';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          color: #00ff00;
          font-family: monospace;
          font-size: 14px;
          line-height: 20px;
          animation: matrix-fall 10s linear infinite;
          white-space: pre-wrap;
          word-break: break-all;
        }

        @keyframes matrix-fall {
          0% {
            transform: translateY(-100%);
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
