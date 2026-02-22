import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Channel from "./pages/Channel";
import EditProfile from "./pages/EditProfile";
import AuthProvider from "./components/AuthProvider";
import WatchHistory from "./pages/WatchHistory";
import Playlist from "./pages/Playlist";
import PlaylistDetail from "./pages/PlaylistDetail";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/video/:videoId" element={<VideoPlayer />} />
          <Route path="/channel/:username" element={<Channel />} />

          {/* Protected routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <WatchHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:playlistId"
            element={
              <ProtectedRoute>
                <PlaylistDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
