import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";

function PlaylistDetail() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axiosInstance.get(`/playlist/${playlistId}`);
        setPlaylist(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`);
      setPlaylist({
        ...playlist,
        videos: playlist.videos.filter((v) => v._id !== videoId),
      });
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

  if (!playlist)
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="text-center mt-20">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-gray-500 text-lg">Playlist not found!</p>
          <Link
            to="/playlists"
            className="text-red-600 text-sm mt-2 inline-block hover:underline"
          >
            ← Back to Playlists
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Playlist Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900">
                {playlist.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {playlist.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <p className="text-gray-400 text-sm">
                  {playlist.totalVideos} videos
                </p>
                <p className="text-gray-400 text-sm">
                  {playlist.totalViews} total views
                </p>
              </div>
            </div>
            <Link
              to="/playlists"
              className="text-gray-400 hover:text-gray-600 text-sm transition"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Videos */}
        {playlist.videos?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🎵</p>
            <p className="text-gray-500">No videos in this playlist yet!</p>
            <Link
              to="/"
              className="text-red-600 text-sm mt-2 inline-block hover:underline"
            >
              Browse videos to add
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {playlist.videos.map((video, index) => (
              <div
                key={video._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 group hover:shadow-md transition"
              >
                <p className="text-gray-400 text-sm font-medium w-5 shrink-0 mt-1">
                  {index + 1}
                </p>
                <Link to={`/video/${video._id}`} className="flex gap-4 flex-1">
                  <div className="relative shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-36 h-20 object-cover rounded-xl group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      {Math.floor(video.duration / 60)}:
                      {String(Math.floor(video.duration % 60)).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-gray-900 font-bold line-clamp-2">
                      {video.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={video.owner?.avatar}
                        alt={video.owner?.username}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <p className="text-gray-500 text-xs">
                        {video.owner?.username}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      {video.views} views
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="text-gray-300 hover:text-red-500 text-xs transition shrink-0 self-start mt-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetail;
