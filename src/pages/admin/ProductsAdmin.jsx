import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';

const emptyProduct = {
  name: '',
  shortDescription: '',
  longDescription: '',
  categoryId: '',
  imageIds: [],
  producer: '',
  origin: '',
  tradition: '',
  visible: true,
  featured: false,
};

function resizeAndUpload(file, addImage) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) { height = (height / width) * maxSize; width = maxSize; }
          else { width = (width / height) * maxSize; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const data = canvas.toDataURL('image/jpeg', 0.85);
        const newImg = addImage({ name: file.name, data });
        resolve(newImg.id);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProductsAdmin() {
  const { products, categories, images, addProduct, updateProduct, deleteProduct, addImage, getImageById } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const startCreate = () => { setForm(emptyProduct); setEditing('new'); };
  const startEdit = (product) => { setForm({ ...product }); setEditing(product.id); };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing === 'new') addProduct(form);
    else updateProduct(editing, form);
    setEditing(null);
  };

  const handleDelete = (id) => { deleteProduct(id); setConfirmDelete(null); };

  const removeImage = (imgId) => {
    setForm(prev => ({ ...prev, imageIds: prev.imageIds.filter(i => i !== imgId) }));
  };

  const processFiles = async (files) => {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const newId = await resizeAndUpload(file, addImage);
      setForm(prev => ({ ...prev, imageIds: [...prev.imageIds, newId] }));
    }
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); };
  const handleFileSelect = (e) => { processFiles(e.target.files); e.target.value = ''; };

  const filtered = products.filter(p => {
    if (filterCat !== 'all' && p.categoryId !== filterCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ─── FORM VIEW ───
  if (editing !== null) {
    const currentImages = (form.imageIds || []).map(getImageById).filter(Boolean);

    return (
      <div className="max-w-3xl">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {editing === 'new' ? 'Crear Producto' : 'Editar Producto'}
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Fotos del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotos del producto</label>

            {/* Thumbnails de fotos actuales */}
            {currentImages.length > 0 && (
              <div className="flex gap-3 flex-wrap mb-3">
                {currentImages.map((img, i) => (
                  <div key={img.id} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img.data} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">Principal</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-terracota-400 bg-terracota-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-gray-500">Arrastra fotos aquí o haz clic para seleccionar</p>
              <p className="text-xs text-gray-400 mt-1">La primera foto será la imagen principal</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400">
              <option value="">Seleccionar categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta *</label>
            <input required value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
              placeholder="1-2 líneas descriptivas" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción larga</label>
            <textarea rows={6} value={form.longDescription} onChange={e => setForm({ ...form, longDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400 resize-none"
              placeholder="Descripción detallada. Usa doble salto de línea para párrafos." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Productor</label>
              <input value={form.producer} onChange={e => setForm({ ...form, producer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
              <input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tradición / Curiosidades</label>
            <textarea rows={3} value={form.tradition} onChange={e => setForm({ ...form, tradition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400 resize-none" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-terracota-500 focus:ring-terracota-400" />
              <span className="text-sm text-gray-700">Visible en la web</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-oliva-500 focus:ring-oliva-400" />
              <span className="text-sm text-gray-700">Producto destacado</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2 bg-tierra-700 hover:bg-tierra-800 text-white rounded-lg font-medium transition-colors">
              {editing === 'new' ? 'Crear Producto' : 'Guardar Cambios'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ─── LIST VIEW ───
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracota-400" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracota-400">
            <option value="all">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={startCreate} className="px-4 py-2 bg-tierra-700 hover:bg-tierra-800 text-white rounded-lg text-sm font-medium transition-colors">
          + Añadir Producto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-500">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Categoría</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(product => {
              const cat = categories.find(c => c.id === product.categoryId);
              const mainImg = product.imageIds?.[0] ? getImageById(product.imageIds[0]) : null;
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {mainImg ? (
                          <img src={mainImg.data} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-800">{product.name}</div>
                        <div className="text-xs text-gray-400 hidden sm:block line-clamp-1">{product.shortDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{cat?.name || '-'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        product.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.visible ? 'Visible' : 'Borrador'}
                      </span>
                      {product.featured && (
                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                          Destacado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => startEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {confirmDelete === product.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(product.id)} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Sí</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">No se encontraron productos</div>
        )}
      </div>
    </div>
  );
}
