import { useState } from 'react';

export default function RegisterModal({ onClose, onRegister, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(
    formData.password
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordValid) return;
    onRegister(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl p-8 w-full max-w-sm text-white shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-amber-400">
          Create your account ✨
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Username (login)"
            value={formData.name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
          <input
            type="text"
            name="displayName"
            placeholder="Display name"
            value={formData.displayName}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email for notifications"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />

          {/* ✅ Campo de contraseña */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 pr-10 rounded focus:outline-none focus:ring-2 ${
                formData.password && !passwordValid
                  ? 'bg-red-900 focus:ring-red-500 text-red-200'
                  : 'bg-gray-800 text-white focus:ring-amber-400'
              }`}
              required
            />

            {/* 👁️ Mostrar/ocultar */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.958 9.958 0 012.121-3.368M9.88 9.88A3 3 0 0114.12 14.12M6.1 6.1l11.8 11.8"
                  />
                </svg>
              )}
            </button>
          </div>

          {!passwordValid && formData.password && (
            <p className="text-xs text-red-400 -mt-2">
              Password must have at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 symbol.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !passwordValid}
            className={`font-semibold py-2 rounded-lg transition ${
              loading || !passwordValid
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {loading ? '...' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-amber-300 transition w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
