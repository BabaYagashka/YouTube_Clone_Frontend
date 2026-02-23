import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search");
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = searchQuery ? `/videos?query=${searchQuery}` : "/videos";
        const response = await axiosInstance.get(url);
        setVideos(response.data.data.docs || []);
        if (searchQuery) {
          try {
            const usersRes = await axiosInstance.get(
              `/users/search?query=${searchQuery}`,
            );
            setChannels(usersRes.data.data || []);
          } catch {
            setChannels([]);
          }
        } else {
          setChannels([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Greeting for logged in users */}
        {isAuthenticated && !searchQuery && (
          <div className="mb-8 bg-white rounded-2xl p-6 flex items-center gap-5 border border-gray-100 shadow-sm">
            <img
              src={user?.avatar}
              alt={user?.username}
              className="w-14 h-14 rounded-full object-cover border-2 border-red-100"
            />
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.fullname?.split(" ")[0]}!
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                What are you watching today?
              </p>
            </div>
            <div className="ml-auto hidden md:flex gap-3">
              <Link
                to="/upload"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
              >
                + Upload Video
              </Link>
              <Link
                to="/dashboard"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Banner for guests */}
        {!isAuthenticated && !searchQuery && (
          <div className="mb-8 bg-white rounded-2xl p-6 flex items-center justify-between border border-gray-100 shadow-sm">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Welcome to VideoTube!
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to like, comment, subscribe and upload videos
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium transition"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Search heading */}
        {searchQuery && (
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">
            Results for <span className="text-red-600">"{searchQuery}"</span>
          </h1>
        )}

        {loading ? (
          <div className="flex items-center justify-center mt-20">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Channels */}
            {searchQuery && channels.length > 0 && (
              <div className="mb-8">
                <h2 className="text-gray-900 text-lg font-semibold mb-4">
                  Channels
                </h2>
                <div className="flex gap-4 flex-wrap">
                  {channels.map((channel) => (
                    <Link
                      to={`/channel/${channel.username}`}
                      key={channel._id}
                      className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 hover:shadow-md transition border border-gray-100"
                    >
                      <img
                        src={channel.avatar}
                        alt={channel.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-gray-900 text-sm font-medium">
                          {channel.fullname}
                        </p>
                        <p className="text-gray-400 text-xs">
                          @{channel.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {!searchQuery && (
              <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
                All Videos
              </h2>
            )}

            {videos.length === 0 ? (
              <div className="text-center mt-16">
                <p className="text-4xl mb-3">🎬</p>
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? `No videos found for "${searchQuery}"`
                    : "No videos yet!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {videos.map((video) => (
                  <Link to={`/video/${video._id}`} key={video._id}>
                    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition duration-200 border border-gray-100 group">
                      <div className="relative overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                        />
                        {/* Duration badge */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                          {Math.floor(video.duration / 60)}:
                          {String(Math.floor(video.duration % 60)).padStart(
                            2,
                            "0",
                          )}
                        </div>
                      </div>
                      <div className="p-3">
                        <h2 className="text-gray-900 font-semibold text-sm line-clamp-2">
                          {video.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={video.ownerDetails?.avatar}
                            alt={video.ownerDetails?.username}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <p className="text-gray-500 text-xs">
                            {video.ownerDetails?.username}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-400 text-xs">
                            {video.views} views
                          </p>
                          <p className="text-gray-400 text-xs">
                            Likes {video.likesCount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
