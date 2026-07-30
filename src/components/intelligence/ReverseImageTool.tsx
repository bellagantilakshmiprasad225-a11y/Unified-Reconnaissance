import React, { useState } from 'react';
import { Image, Upload, ExternalLink, Camera } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { WebcamCapture } from '../common/WebcamCapture';

export const ReverseImageTool: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [showWebcam, setShowWebcam] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleWebcamCapture = (blob: Blob) => {
    setFileName(`webcam_capture_${Date.now()}.png`);
    setFileSize(blob.size);
    const url = URL.createObjectURL(blob);
    setImagePreview(url);
  };

  const reverseEngines = [
    { name: 'Google Lens / Images', url: 'https://images.google.com' },
    { name: 'TinEye Reverse Search', url: 'https://tineye.com' },
    { name: 'Bing Visual Search', url: 'https://www.bing.com/images' },
    { name: 'Yandex Images', url: 'https://yandex.com/images' },
  ];

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-pink-950 text-pink-400 border border-pink-800">
            <Image className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Reverse Image Search OSINT</h3>
            <p className="text-xs text-slate-400">
              Upload image or capture with webcam to prepare reverse visual lookup on major engines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Upload / Capture */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700/80 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
              {imagePreview ? (
                <div className="space-y-3 w-full">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg border border-slate-700 object-contain" />
                  <p className="text-xs font-mono text-cyan-300 truncate">{fileName} ({(fileSize / 1024).toFixed(1)} KB)</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-mono">Select image file or click camera capture</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex-1 py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 cursor-pointer border border-slate-700">
                <Upload className="w-4 h-4" /> Browse File
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button
                onClick={() => setShowWebcam(true)}
                className="flex-1 py-2 px-4 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" /> Webcam
              </button>
            </div>
          </div>

          {/* Right: Search Engines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Legitimate Reverse Image Engines
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Open reverse visual search tools in new tab. Images are processed locally on your device.
            </p>

            <div className="space-y-2">
              {reverseEngines.map((e) => (
                <a
                  key={e.name}
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800 flex items-center justify-between text-xs font-mono text-slate-200 hover:text-white transition-all"
                >
                  <span>{e.name}</span>
                  <ExternalLink className="w-4 h-4 text-pink-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {showWebcam && (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
};
