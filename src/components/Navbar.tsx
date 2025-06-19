import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signInWithGitHub, signOut } = useAuth();

  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-[rgba(10,10,10,0.8)] shadow-lg backdrop-blur-lg">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            social<span className="text-purple-500">.media</span>
          </Link>

          {/* desktop links */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              to="/"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Create Community
            </Link>
          </div>

          {/* desktop auth */}
          <div className="hidden items-center md:flex">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300"> {displayName} </span>
                <button
                  onClick={signOut}
                  className="rounded bg-red-500 px-3 py-1"
                >
                  sign out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="rounded bg-blue-500 px-3 py-1"
              >
                sign in with github
              </button>
            )}
          </div>

          {/* mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="bg-[rgba(10,10,10,0.9)] md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Create Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
