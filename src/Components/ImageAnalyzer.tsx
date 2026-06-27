import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isLoading: boolean;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const MAX_IMAGE_MB = 10;

const ImageAnalyzer = ({ isLoading }: Props) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError('');
    if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) { setError('Unsupported format. Please upload JPG or PNG.'); return; }
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) { setError(`File too large. Max size is ${MAX_IMAGE_MB}MB.`); return; }
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleAnalyze = () => {
    if (!file) { setError('Please upload an image first.'); return; }
    setError('');
    navigate('/analyze-image', { state: { file } });
  };

  const clearFile = () => {
    setFile(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {/* Drop zone */}
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !isLoading && inputRef.current?.click()}
          className="rounded-2xl py-12 px-6 text-center mb-5 transition-all duration-200"
          style={{
            border: `2px dashed ${dragging ? 'var(--color-accent)' : error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            background: dragging ? 'var(--color-accent-glow)' : 'var(--color-bg-input)',
            transform: dragging ? 'scale(1.01)' : 'scale(1)',
          }}
        >
          <div className="text-5xl mb-4">{dragging ? '📁' : '🖼️'}</div>
          <div className="text-base font-semibold text-txt-primary mb-2">
            {dragging ? 'Drop it here!' : 'Drag & drop an image'}
          </div>
          <div className="text-[13px] text-txt-secondary mb-5">or click to browse your files</div>
          <div className="inline-flex gap-2 flex-wrap justify-center">
            {['JPG', 'PNG'].map((fmt) => (
              <span key={fmt} className="px-2.5 py-[3px] bg-bg-secondary border border-border-base rounded-md text-[11px] font-bold text-txt-secondary tracking-wide">
                {fmt}
              </span>
            ))}
          </div>
          <div className="text-xs text-txt-secondary mt-3">Max file size: {MAX_IMAGE_MB}MB</div>
        </div>
      ) : (
        /* Preview */
        <div className="relative rounded-2xl overflow-hidden mb-5 border-2 border-border-base bg-bg-secondary">
          <img src={preview} alt="Preview" className="w-full max-h-[280px] object-cover block" />
          <div className="absolute bottom-0 inset-x-0 px-4 py-3 flex items-center justify-between" style={{
            background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
          }}>
            <div className="text-white">
              <div className="text-[13px] font-semibold">{file?.name}</div>
              <div className="text-[11px] opacity-80">{file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB</div>
            </div>
            <button
              onClick={clearFile}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg cursor-pointer font-sans"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              ✕ Remove
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-[13px] font-medium mb-5 animate-fade-in bg-danger-bg border border-danger-border text-danger">
          ⚠️ {error}
        </div>
      )}

      {/* Analyze button */}
      <button
        className="btn-primary w-full text-base py-4 px-7"
        onClick={handleAnalyze}
        disabled={isLoading || !file}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Analyzing...
          </span>
        ) : 'Analyze Image'}
      </button>
    </div>
  );
};

export default ImageAnalyzer;
