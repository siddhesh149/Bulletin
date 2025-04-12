import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    // In a real app, this would navigate to search results
    console.log('Search for:', searchQuery);
    setSearchOpen(false);
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
            <a className="text-3xl md:text-4xl font-bold font-times text-primary">
              News Media
            </a>
          </Link>
        </div>
        <div className="lg:hidden">
          <button
            className="p-2"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="bg-primary text-white hidden lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-1">
            <li>
              <Link href="/">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/' ? 'bg-blue-900' : ''}`}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/politics">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/politics' ? 'bg-blue-900' : ''}`}>
                  Politics
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/business">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/business' ? 'bg-blue-900' : ''}`}>
                  Business
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/technology">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/technology' ? 'bg-blue-900' : ''}`}>
                  Technology
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/sports">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/sports' ? 'bg-blue-900' : ''}`}>
                  Sports
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/entertainment">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/entertainment' ? 'bg-blue-900' : ''}`}>
                  Entertainment
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/health">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/health' ? 'bg-blue-900' : ''}`}>
                  Health
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/science">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/science' ? 'bg-blue-900' : ''}`}>
                  Science
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/world">
                <a className={`px-3 py-2 block hover:bg-blue-900 text-white transition ${location === '/category/world' ? 'bg-blue-900' : ''}`}>
                  World
                </a>
              </Link>
            </li>

          </ul>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-times text-primary">Menu</h2>
              <button
                className="p-2"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/politics">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Politics
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/business">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Business
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/technology">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Technology
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/sports">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Sports
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Entertainment
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/health">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Health
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/science">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    Science
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/world">
                  <a className="block py-2 border-b" onClick={() => setMobileMenuOpen(false)}>
                    World
                  </a>
                </Link>
              </li>

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
