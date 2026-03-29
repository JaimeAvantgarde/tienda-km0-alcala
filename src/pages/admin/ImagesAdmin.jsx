import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';

export default function ImagesAdmin() {
  const { images, addImage, deleteImage } = useData();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const processFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        // Resize image to max 800px
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 800;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const data = canvas.toDataURL('image/jpeg', 0.85);
          addImage({ name: file.name, data });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div>
      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-8 ${
          dragOver ? 'border-terracota-400 bg-terracota-50' : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
      >
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-600 font-medium">Arrastra imágenes aquí o haz clic para seleccionar</p>
        <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP. Se redimensionan automáticamente a máx. 800px.</p>
      </div>

      {/* Gallery */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{images.length} imágenes</p>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-square">
                <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-500 truncate">{img.name}</p>
              </div>
              {/* Delete overlay */}
              {confirmDelete === img.id ? (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2">
                  <button onClick={() => { deleteImage(img.id); setConfirmDelete(null); }} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Eliminar
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(img.id)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <span className="text-4xl block mb-3">🖼️</span>
          <p>No hay imágenes todavía</p>
          <p className="text-sm mt-1">Sube tu primera imagen para empezar</p>
        </div>
      )}
    </div>
  );
}
