import { Link } from 'react-router-dom';

export default function Navbar() {
  const currentUserId = 'user1';
  return (
    <nav className=" fixed top-0  left-0 w-full bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      <Link to="/about" className="hover:underline">
        About
      </Link>
      <Link to={`/board/${currentUserId}`} className="hover:underline">
        Your Task Board
      </Link>
    </nav>
  );
}
