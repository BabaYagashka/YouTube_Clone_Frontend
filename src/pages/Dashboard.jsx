import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, videosRes] = await Promise.all([
          axiosInstance.get("/dashboard/stats"),
          axiosInstance.get("/dashboard/videos"),
        ]);
        setStats(statsRes.data.data);
        setVideos(videosRes.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      await axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
      setVideos(
        videos.map((v) =>
          v._id === videoId ? { ...v, isPublished: !currentStatus } : v,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axiosInstance.delete(`/videos/${videoId}`);
      setVideos(videos.filter((v) => v._id !== videoId));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
        </div>
      </div>
    );

  const statCards = [
    { label: "Total Videos", value: stats?.totalVideos || 0, icon: "🎬" },
    { label: "Total Views", value: stats?.totalViews || 0, icon: "👁️" },
    { label: "Subscribers", value: stats?.totalSubscribers || 0, icon: "👥" },
    { label: "Total Likes", value: stats?.totalLikes || 0, icon: "👍" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your channel and content
            </p>
          </div>
          <Link
            to="/upload"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
          >
            + Upload Video
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-gray-900 text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Videos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-display text-lg font-bold text-gray-900">
              Your Videos
            </h2>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎬</p>
              <p className="text-gray-500">No videos yet!</p>
              <Link
                to="/upload"
                className="text-red-600 text-sm mt-2 inline-block hover:underline"
              >
                Upload your first video
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-gray-500 font-medium text-left px-5 py-3">
                    Video
                  </th>
                  <th className="text-gray-500 font-medium text-left px-4 py-3">
                    Views
                  </th>
                  <th className="text-gray-500 font-medium text-left px-4 py-3">
                    Likes
                  </th>
                  <th className="text-gray-500 font-medium text-left px-4 py-3">
                    Status
                  </th>
                  <th className="text-gray-500 font-medium text-left px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {videos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-10 rounded-lg object-cover"
                        />
                        <p className="text-gray-900 font-medium line-clamp-1 max-w-xs">
                          {video.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{video.views}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {video.likesCount}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleTogglePublish(video._id, video.isPublished)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          video.isPublished
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {video.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/video/${video._id}`}
                          className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="text-red-400 hover:text-red-600 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
