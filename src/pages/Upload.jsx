import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function Upload() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("videoFile", videoFile);
      data.append("thumbnail", thumbnail);
      await axiosInstance.post("/videos", data);
      navigate("/");
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
            Upload Video
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Share your content with the world
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your video a great title"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell viewers about your video"
                required
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition resize-none"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Video File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  required
                  className="hidden"
                  id="videoFile"
                />
                <label htmlFor="videoFile" className="cursor-pointer">
                  <p className="text-3xl mb-2">🎬</p>
                  <p className="text-gray-600 text-sm font-medium">
                    {videoFile ? videoFile.name : "Click to select video file"}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    MP4, MOV, AVI supported
                  </p>
                </label>
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-red-300 transition">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="preview"
                      className="w-full h-40 object-cover"
                    />
                    <label
                      htmlFor="thumbnail"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition"
                    >
                      <p className="text-white text-sm font-medium">
                        Change thumbnail
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnail}
                      required
                      className="hidden"
                      id="thumbnail"
                    />
                    <label htmlFor="thumbnail" className="cursor-pointer">
                      <p className="text-3xl mb-2">🖼️</p>
                      <p className="text-gray-600 text-sm font-medium">
                        Click to select thumbnail
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        JPG, PNG, WEBP supported
                      </p>
                    </label>
                  </div>
                )}
                {!thumbnailPreview && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnail}
                    required
                    className="hidden"
                    id="thumbnail"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Upload Video"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
