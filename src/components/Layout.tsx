import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { 
  Home, Search, Shield, MessageCircle, User, 
  Menu, X, Globe, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { language, setLanguage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: t('nav.home', language), icon: Home },
    { path: '/programs', label: t('nav.programs', language), icon: Search },
    { path: '/eligibility', label: t('nav.eligibility', language), icon: Shield },
    { path: '/assistant', label: t('nav.assistant', language), icon: MessageCircle },
    { path: '/my-services', label: t('nav.myServices', language), icon: User },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-navy-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-navy-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="font-bold text-navy-900 text-lg hidden sm:block">
              Sarkar Sathi
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path) 
                    ? 'bg-navy-50 text-navy-800' 
                    : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-navy-600 hover:bg-navy-50 transition-colors border border-navy-200"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-navy-600 hover:bg-navy-50"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-navy-50 text-navy-800'
                      : 'text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  const { language } = useApp();
  
  return (
    <footer className="bg-navy-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-navy-900 font-bold text-xs">SS</span>
              </div>
              <span className="font-bold text-lg">Sarkar Sathi</span>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed">
              {t('footer.tagline', language)}
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-navy-200">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/programs" className="block text-sm text-navy-300 hover:text-white transition-colors">
                {t('nav.programs', language)}
              </Link>
              <Link to="/eligibility" className="block text-sm text-navy-300 hover:text-white transition-colors">
                {t('nav.eligibility', language)}
              </Link>
              <Link to="/assistant" className="block text-sm text-navy-300 hover:text-white transition-colors">
                {t('nav.assistant', language)}
              </Link>
              <Link to="/my-services" className="block text-sm text-navy-300 hover:text-white transition-colors">
                {t('nav.myServices', language)}
              </Link>
            </div>
          </div>
          
          {/* Trust */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-navy-200">Important Notice</h3>
            <p className="text-sm text-navy-300 leading-relaxed">
              {t('footer.trust', language)}
            </p>
            <p className="text-xs text-navy-400 mt-3">
              {t('footer.notGovernment', language)}
            </p>
          </div>
        </div>
        
        <div className="border-t border-navy-700 mt-8 pt-6 text-center">
          <p className="text-xs text-navy-400">
            © 2024 Sarkar Sathi. A citizen navigation tool for Pakistan's public services.
          </p>
        </div>
      </div>
    </footer>
  );
}

function MobileBottomNav() {
  const { language } = useApp();
  const location = useLocation();
  
  const items = [
    { path: '/', label: t('nav.home', language), icon: Home },
    { path: '/programs', label: t('nav.programs', language), icon: Search },
    { path: '/assistant', label: 'Assistant', icon: MessageCircle },
    { path: '/my-services', label: 'My', icon: User },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-navy-100 lg:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive(item.path) ? 'text-navy-800' : 'text-navy-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
