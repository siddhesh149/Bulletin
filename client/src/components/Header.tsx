import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import '../styles/header.css';

const Header: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
    setSearchOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    setMobileMenuOpen(false);
    // The actual navigation will be handled by the Link component
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Top bar with date and search */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span>{currentDate}</span>
          <div className="hidden md:flex items-center space-x-4">
            <span>Delhi 34°C</span>
            <span>USD 82.74</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="hover:text-primary"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      
      {/* Logo and brand */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center gap-4">
              <span 
                className="text-3xl md:text-4xl font-bold" 
                style={{ 
                  fontFamily: 'Times New Roman, serif',
                  letterSpacing: '-0.02em',
                  color: '#1e3a8a'
                }}
              >
                Latest News Media
              </span>
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="mobile-menu-button">
            <button
              className="inline-flex items-center justify-center p-3 hover:bg-gray-100 rounded-md transition-colors text-gray-800"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <i className="fas fa-bars text-xl"></i>
              <span className="ml-2 text-sm font-medium">Menu</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="w-full py-2 px-4">
        <div className="container mx-auto">
          <ul className="desktop-nav">
            <li>
              <Link href="/">
                <a 
                  className={`nav-link ${location === '/' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('home')}
                >
                  <i className="fas fa-home"></i>
                  Home
                </a>
              </Link>
            </li>
            {[
              { path: 'politics', icon: 'landmark', label: 'Politics' },
              { path: 'business', icon: 'chart-line', label: 'Business' },
              { path: 'technology', icon: 'microchip', label: 'Technology' },
              { path: 'sports', icon: 'football-ball', label: 'Sports' },
              { path: 'entertainment', icon: 'film', label: 'Entertainment' },
              { path: 'health', icon: 'heartbeat', label: 'Health' },
              { path: 'science', icon: 'flask', label: 'Science' },
              { path: 'world', icon: 'globe', label: 'World' }
            ].map(({ path, icon, label }) => (
              <li key={path}>
                <Link href={`/category/${path}`}>
                  <a 
                    className={`nav-link ${location === `/category/${path}` ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(path)}
                  >
                    <i className={`fas fa-${icon}`}></i>
                    {label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Times New Roman, serif' }}>Menu</h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <ul className="space-y-0">
              <li>
                <Link href="/">
                  <a 
                    className={`block py-3 px-4 hover:bg-gray-100 transition-colors ${location === '/' ? 'bg-gray-100 text-primary' : ''}`}
                    onClick={() => handleCategoryClick('home')}
                  >
                    <i className="fas fa-home mr-2"></i>
                    Home
                  </a>
                </Link>
              </li>
              {[
                { path: 'politics', icon: 'landmark', label: 'Politics' },
                { path: 'business', icon: 'chart-line', label: 'Business' },
                { path: 'technology', icon: 'microchip', label: 'Technology' },
                { path: 'sports', icon: 'football-ball', label: 'Sports' },
                { path: 'entertainment', icon: 'film', label: 'Entertainment' },
                { path: 'health', icon: 'heartbeat', label: 'Health' },
                { path: 'science', icon: 'flask', label: 'Science' },
                { path: 'world', icon: 'globe', label: 'World' }
              ].map(({ path, icon, label }) => (
                <li key={path}>
                  <Link href={`/category/${path}`}>
                    <a 
                      className={`block py-3 px-4 hover:bg-gray-100 transition-colors ${
                        location === `/category/${path}` ? 'bg-gray-100 text-primary' : ''
                      }`}
                      onClick={() => handleCategoryClick(path)}
                    >
                      <i className={`fas fa-${icon} mr-2`}></i>
                      {label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Search form */}
      {searchOpen && (
        <div className="bg-white p-4 shadow-md absolute w-full">
          <div className="container mx-auto">
            <form className="flex" onSubmit={handleSearchSubmit}>
              <Input
                type="text"
                placeholder="Search for news, topics..."
                className="flex-grow p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-primary text-white px-4"
              >
                <i className="fas fa-search"></i>
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
