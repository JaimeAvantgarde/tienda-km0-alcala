import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function getCroppedImage(image, crop, maxSize = 1200) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  let w = crop.width * scaleX;
  let h = crop.height * scaleY;
  if (w > maxSize || h > maxSize) {
    if (w > h) { h = (h / w) * maxSize; w = maxSize; }
    else { w = (w / h) * maxSize; h = maxSize; }
  }
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    crop.x * scaleX, crop.y * scaleY,
    crop.width * scaleX, crop.height * scaleY,
    0, 0, w, h,
  );
  return canvas.toDataURL('image/jpeg', 0.85);
}

export default function ImageCropper({ imageSrc, fileName, onSave, onCancel }) {
  const [crop, setCrop] = useState();
  const imgRef = useRef(null);

  const handleSave = () => {
    if (!crop || !imgRef.current) return;
    const data = getCroppedImage(imgRef.current, crop);
    onSave({ name: fileName, data });
  };

  const handleSaveOriginal = () => {
    // Save without cropping - just resize
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    const maxSize = 1200;
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (w > maxSize || h > maxSize) {
      if (w > h) { h = (h / w) * maxSize; w = maxSize; }
      else { w = (w / h) * maxSize; h = maxSize; }
    }
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    onSave({ name: fileName, data: canvas.toDataURL('image/jpeg', 0.85) });
  };

  const hasCrop = crop && crop.width > 0 && crop.height > 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recortar imagen</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 bg-gray-100 flex justify-center max-h-[60vh] overflow-auto">
          <ReactCrop crop={crop} onChange={setCrop}>
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Recortar"
              style={{ maxHeight: '55vh', maxWidth: '100%' }}
            />
          </ReactCrop>
        </div>

        <div className="px-5 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-3">Arrastra sobre la imagen para seleccionar el área de recorte, o guárdala sin recortar.</p>
          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              Cancelar
            </button>
            <button onClick={handleSaveOriginal} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              Guardar sin recortar
            </button>
            <button
              onClick={handleSave}
              disabled={!hasCrop}
              className="px-5 py-2 bg-oliva-500 hover:bg-oliva-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              Guardar recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
