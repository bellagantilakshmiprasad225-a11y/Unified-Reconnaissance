import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check, X, ShieldAlert } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera permission denied or camera device not available.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);

    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedBlob(blob);
      }
    }, 'image/png');
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedBlob) {
      onCapture(capturedBlob);
      stopCamera();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold font-mono mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-cyan-400" /> Analyst Webcam Capture
        </h3>

        {error ? (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center mb-4">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          {!capturedImage ? (
            <button
              onClick={capturePhoto}
              disabled={!!error}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" /> Capture Photo
            </button>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retake
              </button>
              <button
                onClick={confirmPhoto}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-glow-cyan"
              >
                <Check className="w-4 h-4" /> Use Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
