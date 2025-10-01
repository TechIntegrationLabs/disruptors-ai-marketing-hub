/**
 * Admin Router Integration
 * Integrates admin panel with existing custom routing system
 *
 * Usage in src/pages/index.jsx:
 *
 * import { AdminPanelRoute } from './integration/admin-router-integration'
 *
 * // Add to your PAGES object:
 * const PAGES = {
 *   // ... existing pages
 *   'admin-secret': AdminPanelRoute,
 * }
 *
 * // Or handle directly in routing logic:
 * if (pathname === '/admin/secret') {
 *   return <AdminPanelRoute />
 * }
 */

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AdminRoutes from '../admin/routes'
import { checkSecretPattern, isSecretAccessValid, grantSecretAccess } from '../api/auth'

/**
 * Admin Panel Route Component
 * Lazy-loaded admin bundle that integrates with existing routing
 */
export function AdminPanelRoute() {
  return (
    <BrowserRouter basename="/admin/secret">
      <AdminRoutes />
    </BrowserRouter>
  )
}

/**
 * Hook to enable secret admin access pattern
 * Attach this to your logo component or Ctrl+Shift+D handler
 *
 * Example usage:
 *
 * import { useSecretAdminAccess } from './integration/admin-router-integration'
 *
 * function Logo() {
 *   const { handleClick, clicks } = useSecretAdminAccess()
 *   return <img src="..." onClick={handleClick} />
 * }
 */
export function useSecretAdminAccess() {
  const [clicks, setClicks] = React.useState(0)
  const [lastClickTime, setLastClickTime] = React.useState(0)

  React.useEffect(() => {
    // Reset clicks after 3 seconds
    const timer = setTimeout(() => {
      if (clicks > 0 && Date.now() - lastClickTime > 3000) {
        setClicks(0)
      }
    }, 3100)

    // Check for 5 clicks in 3 seconds
    if (clicks >= 5) {
      grantSecretAccess()
      window.location.href = '/admin/secret'
    }

    return () => clearTimeout(timer)
  }, [clicks, lastClickTime])

  // Keyboard shortcut (Ctrl+Shift+D)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        grantSecretAccess()
        window.location.href = '/admin/secret'
      }

      // Emergency exit (Ctrl+Shift+Escape)
      if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
        e.preventDefault()
        window.location.href = '/'
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClick = () => {
    setClicks(c => c + 1)
    setLastClickTime(Date.now())
  }

  return { handleClick, clicks }
}

/**
 * Check if user has secret access and redirect if needed
 * Use this in your main App or Layout component
 */
export function useSecretAccessRedirect() {
  React.useEffect(() => {
    const hasAccess = checkSecretPattern() && isSecretAccessValid()
    const isOnAdminPage = window.location.pathname.startsWith('/admin/secret')

    if (hasAccess && !isOnAdminPage) {
      // User has valid secret access but not on admin page - do nothing
      return
    }

    if (!hasAccess && isOnAdminPage) {
      // User doesn't have access but trying to access admin - redirect home
      window.location.href = '/'
    }
  }, [])
}

/**
 * Integration Example Component
 * Shows how to integrate with your existing pages/index.jsx
 */
export function AdminIntegrationExample() {
  return `
// In your src/pages/index.jsx:

import React from 'react'
import { AdminPanelRoute, useSecretAdminAccess } from '../integration/admin-router-integration'

// Add to your PAGES object
const PAGES = {
  home: HomePage,
  about: AboutPage,
  // ... other pages ...
  'admin-secret': AdminPanelRoute, // Add this
}

// In your Layout or Logo component:
function Logo() {
  const { handleClick } = useSecretAdminAccess()

  return (
    <img
      src="/logo.svg"
      onClick={handleClick}
      className="cursor-pointer"
    />
  )
}

// Or handle in your routing logic:
function AppRouter() {
  const currentPath = window.location.pathname

  // Check for admin route first
  if (currentPath === '/admin/secret' || currentPath.startsWith('/admin/secret/')) {
    return <AdminPanelRoute />
  }

  // Your existing routing logic
  const pageName = _getCurrentPage()
  const PageComponent = PAGES[pageName]
  return <Layout><PageComponent /></Layout>
}
  `
}
