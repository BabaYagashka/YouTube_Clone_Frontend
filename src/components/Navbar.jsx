import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import axiosInstance from "../utils/axios";
import { useState } from "react";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/?search=${searchQuery}`);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-red-600 rounded-lg p-1.5">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
        <span className="font-display text-xl font-bold text-gray-900">
          VideoTube
        </span>
      </Link>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3 border border-gray-200 focus-within:border-red-400 transition"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos, channels..."
          className="bg-transparent text-gray-800 outline-none w-full placeholder-gray-400 text-sm"
        />
        <button type="submit">
          <svg
            className="w-4 h-4 text-gray-400 hover:text-red-500 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Right Side */}
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-full transition flex items-center gap-1"
          >
            <span>+</span> Upload
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition"
          >
            Dashboard
          </Link>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2"
            >
              <img
                src={user?.avatar}
                alt={user?.username}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-red-400 transition"
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                <Link
                  to={`/channel/${user?.username}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  My Channel
                </Link>
                <Link
                  to="/edit-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Watch History
                </Link>
                <Link
                  to="/playlists"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Playlists
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
