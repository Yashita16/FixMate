import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const VideoCallRoom = () => {
  const { consultationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let zp;

    const initVideo = async () => {
      try {
        const res = await api.get(`/consultations/${consultationId}/token`);
        const { token, roomId, appId } = res.data;

        zp = ZegoUIKitPrebuilt.create(token);
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: true,
          showScreenSharingButton: true,
          showTurnOffRemoteCameraButton: true,
          showTurnOffRemoteMicrophoneButton: true,
          showRemoveUserButton: false,
          onJoinRoom: () => {
            setLoading(false);
          },
          onLeaveRoom: async () => {
            try {
              await api.patch(`/consultations/${consultationId}/complete`);
            } catch {}
            toast.success('Session ended. Please rate your experience!');
            navigate('/consultations');
          },
          onUserLeave: () => {
            toast('The other participant has left the session.', { icon: 'ℹ️' });
          },
        });
      } catch (err) {
        setError(err.message || 'Failed to join video room');
        setLoading(false);
        toast.error(err.message || 'Failed to connect');
      }
    };

    initVideo();

    return () => {
      try { zp?.destroy?.(); } catch {}
    };
  }, [consultationId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🚫</div>
        <h2 className="text-white text-xl font-semibold">Cannot join session</h2>
        <p className="text-slate-400 text-sm">{error}</p>
        <button onClick={() => navigate('/consultations')} className="btn-secondary flex items-center gap-2 mt-4">
          <FiArrowLeft size={14} /> Back to Consultations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-950">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-white text-lg font-medium">Connecting to session...</p>
          <p className="text-slate-400 text-sm mt-2">Setting up your video call with {user?.name}</p>
        </div>
      )}
      <div ref={containerRef} className="w-full h-screen" />
    </div>
  );
};

export default VideoCallRoom;