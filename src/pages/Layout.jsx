

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, ArrowRight, Twitter, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/shared/LoadingScreen";
import MatrixLogin from "@/components/admin/MatrixLogin";
import DisruptorsAdmin from "@/components/admin/DisruptorsAdmin";
import { useSecretAccess } from "@/hooks/useSecretAccess";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(true);
  const [initialLoad, setInitialLoad] = React.useState(true);
  const [scrolled, setScrolled] = React.useState(false);

  // Secret admin access hook
  const {
    showMatrixLogin,
    isAdminAuthenticated,
    adminUser,
    handleLogoClick,
    handleLoginSuccess,
    handleLogout,
    handleCloseMatrix,
    clickCount,
    isTimerActive,
    REQUIRED_CLICKS
  } = useSecretAccess();

  const navItems = [
    { name: "Work", path: "work" },
    { name: "Services", path: "solutions" },
    { name: "About", path: "about" },
    { name: "Podcasting", path: "podcast" },
    { name: "Blog", path: "blog" },
    { name: "Resources", path: "resources" },
    { name: "Gallery", path: "gallery" }
  ];

  const footerLinks = [
      ...navItems,
      { name: "FAQ", path: "faq" },
      { name: "Contact", path: "contact" },
      { name: "Privacy Policy", path: "privacy"},
      { name: "Terms and Conditions", path: "terms" }
  ]

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setInitialLoad(false);
  };
  
  React.useEffect(() => {
    setMobileMenuOpen(false);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  }, [location]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem('hasLoaded');
    if (hasLoadedBefore) {
      setShowLoading(false);
      setInitialLoad(false);
    } else {
      sessionStorage.setItem('hasLoaded', 'true');
      // Ensure loading completes after a short delay if stuck
      const timeout = setTimeout(() => {
        setShowLoading(false);
        setInitialLoad(false);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Conditionally apply header animation only on homepage
  const isHomePage = currentPageName === 'Home';

  return (
    <div className="min-h-screen relative">
        {/* Full-Screen Background Image */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/ui/backgrounds/main-bg.jpg)'
          }}
        />
        
        {/* Content Layer */}
        <div className="relative z-10 min-h-screen">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
            }
          `}</style>

          {showLoading && initialLoad && (
            <LoadingScreen onComplete={handleLoadingComplete} />
          )}

          {/* Admin Interface - Show instead of normal content when authenticated */}
          {isAdminAuthenticated && (
            <DisruptorsAdmin username={adminUser} onLogout={handleLogout} />
          )}

          {/* Matrix Login Modal */}
          {showMatrixLogin && (
            <MatrixLogin onLogin={handleLoginSuccess} onClose={handleCloseMatrix} />
          )}

          {/* Only show normal site content if not in admin mode */}
          {!isAdminAuthenticated && (
            <>
              <header className={`fixed top-0 left-0 right-0 z-50 text-white ${
            isHomePage
              ? `transition-all duration-500 ease-in-out ${scrolled ? 'bg-black/70 backdrop-blur-md' : 'bg-black/30 backdrop-blur-sm'}`
              : 'bg-black/70 backdrop-blur-md'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex justify-between items-center ${
                isHomePage 
                  ? `transition-all duration-500 ease-in-out ${scrolled ? 'h-20' : 'h-32'}`
                  : 'h-20'
              }`}>
                <Link to={createPageUrl('')}>
                  <div
                    onClick={handleLogoClick}
                    className="relative cursor-pointer"
                  >
                    <img
                      src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758752837/logo_a4toul.png"
                      alt="Disruptors Media Logo"
                      className={`object-contain w-auto transition-all duration-500 ease-in-out ${
                        isHomePage
                          ? `${scrolled ? 'h-10' : 'h-12'}`
                          : 'h-10'
                      } ${isTimerActive ? 'animate-pulse' : ''}`}
                    />

                    {/* Secret Access Progress Indicator */}
                    {isTimerActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded">
                        <div
                          className="h-full bg-green-400 rounded transition-all duration-200"
                          style={{ width: `${(clickCount / REQUIRED_CLICKS) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </Link>

                <nav className="hidden lg:flex items-center space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.path)}
                      className="text-xs font-semibold uppercase tracking-widest transition-colors hover:text-gray-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="hidden lg:flex items-center">
                   <Link to={createPageUrl('book-strategy-session')} className="group relative inline-flex items-center justify-center h-10 px-6 text-xs font-bold text-white uppercase bg-transparent border border-white" style={{clipPath: 'polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)'}}>
                      <span>Book a Call</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                   </Link>
                </div>

                <button
                  className="lg:hidden p-2 text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`lg:hidden border-t border-gray-700 ${
                    isHomePage
                      ? `transition-colors duration-500 ${scrolled ? 'bg-black/70 backdrop-blur-md' : 'bg-black/30 backdrop-blur-sm'}`
                      : 'bg-black/70 backdrop-blur-md'
                  }`}
                >
                  <div className="px-4 py-6 space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={createPageUrl(item.path)}
                        className="block text-base font-medium text-white hover:text-gray-300 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                     <Button asChild className="w-full mt-4 bg-white text-black hover:bg-gray-200">
                        <Link to={createPageUrl('book-strategy-session')}>Book a Call</Link>
                     </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>
          
          <div className={`${!isHomePage && 'pt-20'}`}>
            <AnimatePresence mode="wait">
              <motion.main
                key={currentPageName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {!showLoading && children}
              </motion.main>
            </AnimatePresence>
          </div>

          <footer className="bg-gray-900/95 backdrop-blur-sm text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Top Section */}
              <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Get a free quote</h2>
                <p className="text-gray-300">Think you need something but not sure what? That's what we're here for. Get in touch!</p>
              </div>
              
              {/* Decorative lines */}
              <div className="space-y-1.5 my-16">
                  {Array.from({length: 8}).map((_, i) => <div key={i} className="h-0.5 bg-white/50 w-full"></div>)}
              </div>

              {/* Book a call bar */}
              <Link to={createPageUrl('book-strategy-session')} className="group flex items-center justify-between p-8 bg-[#212121] text-white hover:bg-black transition-colors mb-20">
                  <span className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Book a call</span>
                  <ArrowRight className="w-12 h-12 md:w-16 md:h-16 transition-transform group-hover:translate-x-4" />
              </Link>

              {/* Footer nav */}
              <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-16">
                  {footerLinks.map(link => (
                      <Link key={link.name} to={createPageUrl(link.path)} className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{link.name}</Link>
                  ))}
              </nav>

              {/* Bottom bar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-gray-500 font-mono tracking-wider">
                  <div className="text-center md:text-left">
                      <p>&copy;{new Date().getFullYear()} DISRUPTORS MEDIA INC.</p>
                      <p>82924 N MAIN ST, NORTH SALT LAKE, UT 84054</p>
                  </div>
                  <div className="flex items-center gap-6">
                      <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
                      <a href="#" className="hover:text-white"><Youtube className="w-5 h-5" /></a>
                      <a href="#" className="hover:text-white"><Instagram className="w-5 h-5" /></a>
                  </div>
                  <div className="text-center md:text-right">
                      <p>40.853490, -111.911790</p>
                      <p>LOAD ADDRESS: 034520-01, ISCXX COMPRESSED</p>
                  </div>
              </div>

            </div>
          </footer>
            </>
          )}
        </div>
    </div>
  );
}

