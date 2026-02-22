import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import axiosInstance from "../utils/axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/users/login", formData);
      dispatch(
        login({
          user: response.data.data.user,
          accessToken: response.data.data.accessToken,
        }),
      );
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex">
      {/* Left - Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop"
          alt="cinema"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-red-600 rounded-lg p-1.5">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <span className="font-display text-white text-2xl font-bold">
              VideoTube
            </span>
          </div>
          <h2 className="font-display text-white text-3xl font-bold leading-tight">
            Watch, share and
            <br />
            discover great videos
          </h2>
          <p className="text-gray-300 mt-3 text-sm leading-relaxed">
            Join millions of creators and viewers. Upload your content, build
            your audience, and connect with the world.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
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
          </div>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
