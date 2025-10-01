import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import AdminPortal from './admin-portal'

function App() {
  // Check for admin route BEFORE any other routing
  // This ensures admin panel is completely isolated from public site
  if (window.location.pathname.startsWith('/admin/secret')) {
    return <AdminPortal />
  }

  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 