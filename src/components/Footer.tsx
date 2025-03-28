
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sportyfi-black text-white pt-12 pb-6">
      <div className="sportyfi-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-sportyfi-orange">Sporty</span>Fi
            </h3>
            <p className="text-gray-300 mb-4">
              The ultimate sports networking & matchmaking platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/matches" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Find Matches
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/leaderboards" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Leaderboards
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Sports</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sports/football" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Football
                </Link>
              </li>
              <li>
                <Link to="/sports/cricket" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Cricket
                </Link>
              </li>
              <li>
                <Link to="/sports/basketball" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Basketball
                </Link>
              </li>
              <li>
                <Link to="/sports/tennis" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Tennis
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-sportyfi-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SportyFi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
