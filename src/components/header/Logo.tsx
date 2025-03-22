
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-bold">
        <span className="text-sportyfi-orange">Sporty</span>Fi
      </span>
    </Link>
  );
};

export default Logo;
