
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

export const navigationLinks = [
  { title: 'Home', path: '/' },
  { title: 'Matches', path: '/matches' },
  { title: 'Tournaments', path: '/tournaments' },
  { title: 'Watch Matches', path: '/watch', icon: <PlayCircle size={18} className="text-red-500" /> },
  { title: 'Grounds Booking', path: '/venues' },
  { title: 'Leaderboards', path: '/leaderboards' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
];

interface NavigationLinksProps {
  onClick?: () => void;
  className?: string;
  linkClassName?: string;
}

const NavigationLinks = ({ onClick, className = "", linkClassName = "" }: NavigationLinksProps) => {
  return (
    <nav className={className}>
      {navigationLinks.map((link) => (
        <Link
          key={link.title}
          to={link.path}
          className={linkClassName}
          onClick={onClick}
        >
          {link.icon && link.icon}
          {link.title}
          {link.title === 'Watch Matches' && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Live</span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationLinks;
