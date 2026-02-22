import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";
import { setUser } from "../store/authSlice";

function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axiosInstance.patch("/users/update-account", {
        fullname,
      });
      dispatch(setUser(response.data.data));
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatar) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      data.append("avatar", avatar);
      const response = await axiosInstance.patch("/users/avatar", data);
      dispatch(setUser(response.data.data));
      setSuccess("Avatar updated successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCoverImage = async (e) => {
    e.preventDefault();
    if (!coverImage) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      data.append("coverImage", coverImage);
      const response = await axiosInstance.patch("/users/cover-image", data);
      dispatch(setUser(response.data.data));
      setSuccess("Cover image updated!");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post("/users/change-password", {
        oldPassword,
        newPassword,
      });
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Edit Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update your account information
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Current Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 flex items-center gap-4">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <p className="text-gray-900 font-semibold">{user?.fullname}</p>
            <p className="text-gray-400 text-sm">@{user?.username}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Update Name */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
            Update Name
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-sm transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Update Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
            Update Avatar
          </h2>
          <form onSubmit={handleUpdateAvatar} className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:text-xs file:cursor-pointer text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Update Avatar"}
            </button>
          </form>
        </div>

        {/* Update Cover */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
            Update Cover Image
          </h2>
          <form onSubmit={handleUpdateCoverImage} className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-600 file:text-xs file:cursor-pointer text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Update Cover"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current password"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
