import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axios";
import { useSelector } from "react-redux";

function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axiosInstance.get(`/users/channel/${username}`);
        setChannel(response.data.data);
        setIsSubscribed(response.data.data.isSubscribed);
        const videosRes = await axiosInstance.get(
          `/videos?userId=${response.data.data._id}`,
        );
        setVideos(videosRes.data.data.docs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [username]);

  const handleSubscribe = async () => {
    try {
      await axiosInstance.post(`/subscriptions/c/${channel._id}`);
      setIsSubscribed(!isSubscribed);
      setChannel({
        ...channel,
        subscribersCount: isSubscribed
          ? channel.subscribersCount - 1
          : channel.subscribersCount + 1,
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

  if (!channel)
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="text-center mt-20">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-gray-500 text-lg">Channel not found!</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* Cover */}
      <div className="w-full h-52 bg-gray-200 overflow-hidden">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-red-100 to-orange-100" />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Channel Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-8 mb-6 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={channel.avatar}
              alt={channel.username}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md -mt-10"
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                {channel.fullname}
              </h1>
              <p className="text-gray-400 text-sm">@{channel.username}</p>
              <p className="text-gray-500 text-sm mt-0.5">
                {channel.subscribersCount} subscribers
              </p>
            </div>
          </div>
          {user?.username !== channel.username && (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition ${
                isSubscribed
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isSubscribed ? "✓ Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        {/* Videos */}
        <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
          Videos
        </h2>
        {videos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-gray-500">No videos uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {videos.map((video) => (
              <Link to={`/video/${video._id}`} key={video._id}>
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition duration-200 border border-gray-100 group">
                  <div className="overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="text-gray-900 font-semibold text-sm line-clamp-2">
                      {video.title}
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                      {video.views} views
                    </p>
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

export default Channel;
