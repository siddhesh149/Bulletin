import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-times font-bold mb-4">News Media</h3>
            <p className="text-neutral-300 mb-4">
              Your trusted source for breaking news, in-depth analysis and important stories from around the globe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/politics">
                  <a className="text-neutral-300 hover:text-white">Politics</a>
                </Link>
              </li>
              <li>
                <Link href="/category/business">
                  <a className="text-neutral-300 hover:text-white">Business</a>
                </Link>
              </li>
              <li>
                <Link href="/category/technology">
                  <a className="text-neutral-300 hover:text-white">Technology</a>
                </Link>
              </li>
              <li>
                <Link href="/category/sports">
                  <a className="text-neutral-300 hover:text-white">Sports</a>
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment">
                  <a className="text-neutral-300 hover:text-white">Entertainment</a>
                </Link>
              </li>
              <li>
                <Link href="/category/world">
                  <a className="text-neutral-300 hover:text-white">World</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-300 hover:text-white">Latest News</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white">Breaking Stories</a>
              </li>
              <li>
                <Link href="/category/opinion">
                  <a className="text-neutral-300 hover:text-white">Opinion & Analysis</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white">Video Reports</a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white">Newsletters</a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white">Podcasts</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <address className="text-neutral-300 not-italic">
              <p>New Delhi, India</p>
              <p className="mt-3">
                <a href="mailto:info@newsmedia.com" className="hover:text-white">info@newsmedia.com</a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-700 text-sm text-neutral-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} News Media. All rights reserved.</p>
            <ul className="flex flex-wrap mt-4 md:mt-0">
              <li className="mr-4"><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li className="mr-4"><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Accessibility</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
