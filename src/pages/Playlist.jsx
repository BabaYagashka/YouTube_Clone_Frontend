import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";
import { useSelector } from "react-redux";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axiosInstance.get(`/playlist/user/${user._id}`);
        setPlaylists(response.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [user._id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const response = await axiosInstance.post("/playlist", newPlaylist);
      setPlaylists([response.data.data, ...playlists]);
      setNewPlaylist({ name: "", description: "" });
      setShowCreate(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (playlistId) => {
    if (!window.confirm("Delete this playlist?")) return;
    try {
      await axiosInstance.delete(`/playlist/${playlistId}`);
      setPlaylists(playlists.filter((p) => p._id !== playlistId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Your Playlists
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Organize your favorite videos
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
          >
            + New Playlist
          </button>
        </div>

        {/* Create Playlist Form */}
        {showCreate && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
              Create Playlist
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  value={newPlaylist.name}
                  onChange={(e) =>
                    setNewPlaylist({ ...newPlaylist, name: e.target.value })
                  }
                  placeholder="Playlist name"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) =>
                    setNewPlaylist({
                      ...newPlaylist,
                      description: e.target.value,
                    })
                  }
                  placeholder="Playlist description"
                  required
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400 text-sm transition resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Playlists */}
        {loading ? (
          <div className="flex items-center justify-center mt-20">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center mt-20 bg-white rounded-2xl p-10 border border-gray-100">
            <p className="text-4xl mb-3">🎵</p>
            <p className="text-gray-500 text-lg">No playlists yet!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="text-red-600 text-sm mt-2 inline-block hover:underline"
            >
              Create your first playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                {/* Thumbnail Grid */}
                <Link to={`/playlist/${playlist._id}`}>
                  <div className="grid grid-cols-2 gap-0.5 h-36 bg-gray-100 overflow-hidden">
                    {playlist.videos?.slice(0, 4).map((video, i) => (
                      <img
                        key={i}
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ))}
                    {playlist.videos?.length === 0 && (
                      <div className="col-span-2 flex items-center justify-center h-full bg-gray-100">
                        <p className="text-4xl">🎵</p>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/playlist/${playlist._id}`}>
                    <h2 className="font-display text-gray-900 font-bold text-base hover:text-red-600 transition">
                      {playlist.name}
                    </h2>
                  </Link>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                    {playlist.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-gray-500 text-xs">
                      {playlist.totalVideos || 0} videos
                    </p>
                    <button
                      onClick={() => handleDelete(playlist._id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlist;
