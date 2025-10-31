import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterModal from './RegisterModal';

export default function Navbar() {
  const { user, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', password: '' });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(formData);
      navigate(`/board/${formData.name}`);
    } catch (err) {
      setError('❌ Invalid credentials or user not found.', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-sm text-white p-4 flex justify-between items-center shadow-md z-50">
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-xl font-bold hover:text-amber-400 transition">
            Meme Task Board 🎭
          </Link>
          <Link to="/about" className="hover:text-amber-300 transition">
            About
          </Link>
        </div>

        {user ? (
          <div className="flex gap-4 items-center">
            <Link
              to={`/board/${user.id || user.name}`}
              className="bg-amber-500 text-black px-4 py-1 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              {user.displayName ? `${user.displayName}'s Board` : `${user.name}'s Board`}
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            className="flex gap-2 items-center bg-gray-800 p-2 rounded-lg"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="User"
              className="px-2 py-1 rounded bg-gray-700 text-sm text-white focus:outline-none"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="px-2 py-1 rounded bg-gray-700 text-sm text-white focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 text-black font-semibold px-3 py-1 rounded hover:bg-amber-400 transition text-sm"
            >
              {loading ? '...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="text-xs text-gray-400 hover:text-amber-300 ml-1 transition"
            >
              Create account
            </button>
            {error && <span className="text-red-400 text-xs ml-2">{error}</span>}
          </form>
        )}
      </nav>

      {/* 🧾 Modal separado */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegister={async (data) => {
            try {
              await register(data);
              setShowRegisterModal(false);
              navigate(`/board/${data.name}`);
            } catch (err) {
              setError('⚠️ Could not register user.', err);
            }
          }}
          loading={loading}
        />
      )}
    </>
  );
}
