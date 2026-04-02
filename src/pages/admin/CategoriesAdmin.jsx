import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import ImageCropper from '../../components/admin/ImageCropper';

const emptyCategory = { name: '', description: '', icon: '', gradient: '', order: 1, imageId: null };

export default function CategoriesAdmin() {
  const { categories, products, addImage, addCategory, updateCategory, deleteCategory, getImageById } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCategory);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [cropData, setCropData] = useState(null);
  const fileRef = useRef();

  const startCreate = () => { setForm({ ...emptyCategory, order: categories.length + 1 }); setEditing('new'); };
  const startEdit = (cat) => { setForm({ ...cat }); setEditing(cat.id); };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing === 'new') addCategory(form);
    else updateCategory(editing, form);
    setEditing(null);
  };

  const handleDelete = (id) => {
    const count = products.filter(p => p.categoryId === id).length;
    if (count > 0) {
      alert(`Esta categoría tiene ${count} producto(s) asociado(s). Reasígnalos antes de eliminarla.`);
      setConfirmDelete(null);
      return;
    }
    deleteCategory(id);
    setConfirmDelete(null);
  };

  const openCropFromFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setCropData({ src: e.target.result, name: file.name });
    reader.readAsDataURL(file);
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    openCropFromFile(e.dataTransfer.files[0]);
  };

  const handlePhotoSelect = (e) => {
    openCropFromFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleCropSave = ({ name, data }) => {
    const newImg = addImage({ name, data });
    setForm(prev => ({ ...prev, imageId: newImg.id }));
    setCropData(null);
  };

  // ─── FORM VIEW ───
  if (editing !== null) {
    const currentImage = form.imageId ? getImageById(form.imageId) : null;

    return (
      <div className="max-w-2xl">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {editing === 'new' ? 'Crear Categoría' : 'Editar Categoría'}
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Foto de la categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto de la categoría</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />

            <div className="flex gap-3 flex-wrap">
              {currentImage && (
                <div className="relative group w-28 h-28 rounded-xl overflow-hidden border border-gray-200">
                  <img src={currentImage.data} alt="Foto categoría" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageId: null })}
                    className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handlePhotoDrop}
                onClick={() => fileRef.current?.click()}
                className={`w-28 h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  dragOver ? 'border-oliva-400 bg-oliva-50' : 'border-gray-300 hover:border-oliva-400 hover:bg-gray-50'
                }`}
              >
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-400 mt-1">{currentImage ? 'Cambiar' : 'Añadir'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
            <input type="number" min={1} value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg font-medium transition-colors">
              {editing === 'new' ? 'Crear' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
          </div>
        </form>

        {cropData && (
          <ImageCropper
            imageSrc={cropData.src}
            fileName={cropData.name}
            onSave={handleCropSave}
            onCancel={() => setCropData(null)}
          />
        )}
      </div>
    );
  }

  // ─── LIST VIEW ───
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{categories.length} categorías</p>
        <button onClick={startCreate} className="px-4 py-2 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg text-sm font-medium transition-colors">
          + Añadir Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const productCount = products.filter(p => p.categoryId === cat.id).length;
          const catImage = cat.imageId ? getImageById(cat.imageId) : null;
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                {catImage ? (
                  <img src={catImage.data} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs">Sin foto</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{productCount} productos · Orden: {cat.order}</span>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(cat)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {confirmDelete === cat.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(cat.id)} className="px-2 py-1 text-xs bg-red-500 text-white rounded">Sí</button>
                        <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 text-xs bg-gray-200 rounded">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
