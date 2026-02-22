import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";
import { useSelector } from "react-redux";

function VideoPlayer() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [playlistMsg, setPlaylistMsg] = useState("");
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axiosInstance.get(`/videos/${videoId}`);
        setVideo(response.data.data);
        setIsLiked(response.data.data.isLiked);
        setIsSubscribed(response.data.data.owner?.isSubscribed);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/comment/${videoId}`);
        setComments(response.data.data.docs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!isAuthenticated || !user?._id) return;
      try {
        const response = await axiosInstance.get(`/playlist/user/${user._id}`);
        setPlaylists(response.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaylists();
  }, [isAuthenticated, user]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(!isLiked);
      setVideo((prev) => ({
        ...prev,
        likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) return;
    try {
      await axiosInstance.post(`/subscriptions/c/${video.owner._id}`);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await axiosInstance.post(`/comment/${videoId}`, {
        content: newComment,
      });
      setComments([response.data.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comment/c/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`);
      setPlaylistMsg("Added to playlist!");
      setShowPlaylistMenu(false);
      setTimeout(() => setPlaylistMsg(""), 3000);
    } catch (error) {
      setPlaylistMsg("Already in playlist or failed!");
      setTimeout(() => setPlaylistMsg(""), 3000);
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

  if (!video)
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="text-center mt-20">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-gray-500 text-lg">Video not found!</p>
          <Link
            to="/"
            className="text-red-600 text-sm mt-2 inline-block hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Video */}
        <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
          <video
            src={video.videoFile}
            controls
            className="w-full"
            style={{ maxHeight: "520px" }}
          />
        </div>

        {/* Info */}
        <div className="mt-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {video.title}
          </h1>

          {/* Playlist success msg */}
          {playlistMsg && (
            <div className="mt-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-2 text-sm">
              ✅ {playlistMsg}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-400 text-sm">{video.views} views</p>
            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition border ${
                  isLiked
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500"
                }`}
              >
                👍 {isLiked ? "Liked" : "Like"} · {video.likesCount}
              </button>

              {/* Add to Playlist Button */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition border bg-gray-50 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500"
                  >
                    🎵 Save
                  </button>
                  {showPlaylistMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                      <p className="px-4 py-1 text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Add to playlist
                      </p>
                      {playlists.length === 0 ? (
                        <div className="px-4 py-3 text-center">
                          <p className="text-gray-400 text-xs">
                            No playlists yet!
                          </p>
                          <Link
                            to="/playlists"
                            className="text-red-600 text-xs hover:underline mt-1 inline-block"
                            onClick={() => setShowPlaylistMenu(false)}
                          >
                            Create one
                          </Link>
                        </div>
                      ) : (
                        playlists.map((playlist) => (
                          <button
                            key={playlist._id}
                            onClick={() => handleAddToPlaylist(playlist._id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            🎵 {playlist.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100 my-4" />

          {/* Channel */}
          <div className="flex items-center justify-between">
            <Link
              to={`/channel/${video.owner?.username}`}
              className="flex items-center gap-3"
            >
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username}
                className="w-11 h-11 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <p className="text-gray-900 font-semibold text-sm">
                  {video.owner?.username}
                </p>
                <p className="text-gray-400 text-xs">
                  {video.owner?.subscribersCount} subscribers
                </p>
              </div>
            </Link>
            {isAuthenticated && user?._id !== video.owner?._id && (
              <button
                onClick={handleSubscribe}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  isSubscribed
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Description */}
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
            Comments ({comments.length})
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                  Post
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center border border-gray-100">
              <p className="text-gray-500 text-sm">
                <Link
                  to="/login"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Sign in
                </Link>{" "}
                to add a comment
              </p>
            </div>
          )}

          {commentsLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <img
                    src={comment.owner?.avatar}
                    alt={comment.owner?.username}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 text-sm font-medium">
                          {comment.owner?.username}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {isAuthenticated && user?._id === comment.owner?._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500 text-xs transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
