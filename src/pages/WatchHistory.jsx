import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/users/watch-history");
        setHistory(response.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Watch History
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Videos you've watched recently
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center mt-20">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center mt-20 bg-white rounded-2xl p-10 border border-gray-100">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-gray-500 text-lg">No watch history yet!</p>
            <Link
              to="/"
              className="text-red-600 text-sm mt-2 inline-block hover:underline"
            >
              Browse videos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((video) => (
              <Link to={`/video/${video._id}`} key={video._id}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md m-4 transition p-4 flex gap-4 group">
                  <div className="relative shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-40 h-24 object-cover rounded-xl group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                      {Math.floor(video.duration / 60)}:
                      {String(Math.floor(video.duration % 60)).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-gray-900 font-bold text-lg line-clamp-2">
                      {video.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={video.owner?.avatar}
                        alt={video.owner?.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <p className="text-gray-500 text-sm">
                        {video.owner?.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-gray-400 text-xs">
                        {video.views} views
                      </p>
                      <p className="text-gray-400 text-xs">·</p>
                      <p className="text-gray-400 text-xs">
                        {video.description?.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchHistory;
