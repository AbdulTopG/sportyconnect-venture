
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-sportyfi-black text-white">
      <div className="sportyfi-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">
              <span className="text-sportyfi-orange">Sporty</span>Fi
            </h3>
            <p className="text-gray-300">
              Connect with athletes, host matches, and participate in tournaments on the ultimate sports networking platform.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/matches" className="text-gray-300 hover:text-sportyfi-orange transition-colors">Find Matches</Link></li>
              <li><Link to="/tournaments" className="text-gray-300 hover:text-sportyfi-orange transition-colors">Tournaments</Link></li>
              <li><Link to="/venues" className="text-gray-300 hover:text-sportyfi-orange transition-colors">Venues</Link></li>
              <li><Link to="/watch" className="text-gray-300 hover:text-sportyfi-orange transition-colors">Watch Matches</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-sportyfi-orange transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-sportyfi-orange transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail size={16} className="text-sportyfi-orange" />
                <span>support@sportyfi.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone size={16} className="text-sportyfi-orange" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} SportyFi. All rights reserved.</p>
          <p className="mt-2 text-sm">The ultimate sports networking platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
