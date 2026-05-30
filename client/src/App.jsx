import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ExpertListing from './pages/ExpertListing.jsx';
import ExpertProfilePage from './pages/ExpertProfilePage.jsx';
import IssueSubmission from './pages/IssueSubmission.jsx';
import VideoCallRoom from './pages/VideoCallRoom.jsx';
import Profile from './pages/Profile.jsx';
import Notifications from './pages/Notifications.jsx';
import ConsultationHistory from './pages/ConsultationHistory.jsx';
import ExpertDashboard from './pages/ExpertDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/experts" element={<ExpertListing />} />
    <Route path="/experts/:id" element={<ExpertProfilePage />} />

    {/* Protected – any authenticated user */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/consultations" element={<ConsultationHistory />} />
      <Route path="/issues/new" element={<IssueSubmission />} />
      <Route path="/room/:consultationId" element={<VideoCallRoom />} />
    </Route>

    {/* Expert only */}
    <Route element={<RoleRoute roles={['expert']} />}>
      <Route path="/expert/dashboard" element={<ExpertDashboard />} />
    </Route>

    {/* Admin only */}
    <Route element={<RoleRoute roles={['admin']} />}>
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;