import { useState, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useData } from '../../context/DataContext';
import ImageCropper from '../../components/admin/ImageCropper';

const emptyProduct = {
  name: '',
  shortDescription: '',
  longDescription: '',
  categoryId: '',
  imageIds: [],
  price: null,
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
        const maxSize = 1200;
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

function SortablePhoto({ img, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="relative group w-28 h-28 rounded-xl overflow-hidden border border-gray-200 cursor-grab active:cursor-grabbing"
    >
      <img src={img.data} alt={`Foto ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(img.id)}
        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {index === 0 && (
        <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded pointer-events-none">Principal</span>
      )}
    </div>
  );
}

function ProductRow({ product, categories, getImageById, onEdit, onDelete, onToggleFeatured, confirmDelete, setConfirmDelete, showGrip, dragProps, style }) {
  const cat = categories.find(c => c.id === product.categoryId);
  const mainImg = product.imageIds?.[0] ? getImageById(product.imageIds[0]) : null;

  return (
    <div className="flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors" style={style}>
      {showGrip && (
        <div className="px-2 w-10 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500" {...dragProps}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
            <circle cx="9" cy="10" r="1.5" /><circle cx="15" cy="10" r="1.5" />
            <circle cx="9" cy="15" r="1.5" /><circle cx="15" cy="15" r="1.5" />
            <circle cx="9" cy="20" r="1.5" /><circle cx="15" cy="20" r="1.5" />
          </svg>
        </div>
      )}
      <div className="px-4 py-3 flex-1">
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
      </div>
      <div className="px-4 py-3 text-sm text-gray-500 w-24 hidden md:block">{cat?.name || '-'}</div>
      <div className="px-4 py-3 text-sm font-semibold text-gray-700 w-20 hidden sm:block">{product.price != null ? `${product.price.toFixed(2)}€` : '-'}</div>
      <div className="px-2 py-3 w-10 hidden sm:flex items-center justify-center">
        <button
          onClick={() => onToggleFeatured(product.id, !product.featured)}
          className={`p-1 rounded transition-colors ${product.featured ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
          title={product.featured ? 'Quitar destacado' : 'Marcar como destacado'}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={product.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-3 w-24 hidden sm:block">
        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
          product.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {product.visible ? 'Visible' : 'Borrador'}
        </span>
      </div>
      <div className="px-4 py-3 w-24 text-right">
        <div className="flex justify-end gap-1">
          <button onClick={() => onEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {confirmDelete === product.id ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(product.id)} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Sí</button>
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
      </div>
    </div>
  );
}

function SortableRow(props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    position: 'relative',
    background: isDragging ? '#f0fdf4' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ProductRow {...props} showGrip dragProps={listeners} />
    </div>
  );
}

export default function ProductsAdmin() {
  const { products, categories, images, addProduct, updateProduct, deleteProduct, reorderProducts, addImage, getImageById } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [cropQueue, setCropQueue] = useState([]);
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
  const toggleFeatured = (id, featured) => { updateProduct(id, { featured }); };

  const removeImage = (imgId) => {
    setForm(prev => ({ ...prev, imageIds: prev.imageIds.filter(i => i !== imgId) }));
  };

  const queueFilesForCrop = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropQueue(prev => [...prev, { src: e.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCropSave = ({ name, data }) => {
    const newImg = addImage({ name, data });
    setForm(prev => ({ ...prev, imageIds: [...prev.imageIds, newImg.id] }));
    setCropQueue(prev => prev.slice(1));
  };

  const handleCropCancel = () => {
    setCropQueue(prev => prev.slice(1));
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); queueFilesForCrop(e.dataTransfer.files); };
  const handleFileSelect = (e) => { queueFilesForCrop(e.target.files); e.target.value = ''; };

  const isFiltering = filterCat !== 'all' || search.trim() !== '';

  const filtered = products.filter(p => {
    if (filterCat !== 'all' && p.categoryId !== filterCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = products.findIndex(p => p.id === active.id);
    const to = products.findIndex(p => p.id === over.id);
    if (from !== -1 && to !== -1) reorderProducts(from, to);
  };

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
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

            <div className="flex gap-3 flex-wrap">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;
                  const oldIndex = form.imageIds.indexOf(active.id);
                  const newIndex = form.imageIds.indexOf(over.id);
                  setForm(prev => ({ ...prev, imageIds: arrayMove(prev.imageIds, oldIndex, newIndex) }));
                }}
              >
                <SortableContext items={form.imageIds} strategy={horizontalListSortingStrategy}>
                  {currentImages.map((img, i) => (
                    <SortablePhoto key={img.id} img={img} index={i} onRemove={removeImage} />
                  ))}
                </SortableContext>
              </DndContext>

              {/* Botón añadir foto */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`w-28 h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  dragOver ? 'border-oliva-400 bg-oliva-50' : 'border-gray-300 hover:border-oliva-400 hover:bg-gray-50'
                }`}
              >
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-400 mt-1">Añadir</span>
              </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (&euro;) *</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price ?? ''}
              onChange={e => setForm({ ...form, price: e.target.value === '' ? null : parseFloat(e.target.value) })}
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracota-400"
              placeholder="0.00"
            />
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
            <button type="submit" className="px-6 py-2 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg font-medium transition-colors">
              {editing === 'new' ? 'Crear Producto' : 'Guardar Cambios'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
          </div>
        </form>

        {cropQueue.length > 0 && (
          <ImageCropper
            imageSrc={cropQueue[0].src}
            fileName={cropQueue[0].name}
            onSave={handleCropSave}
            onCancel={handleCropCancel}
          />
        )}
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
        <button onClick={startCreate} className="px-4 py-2 bg-oliva-500 hover:bg-oliva-600 text-white rounded-lg text-sm font-medium transition-colors">
          + Añadir Producto
        </button>
      </div>

      {!isFiltering && (
        <p className="text-xs text-gray-400 mb-3">Arrastra los productos para cambiar el orden en que aparecen en la web.</p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 text-left text-sm text-gray-500 flex">
          {!isFiltering && <div className="px-2 py-3 w-10 shrink-0" />}
          <div className="px-4 py-3 font-medium flex-1">Producto</div>
          <div className="px-4 py-3 font-medium w-24 hidden md:block">Categoría</div>
          <div className="px-4 py-3 font-medium w-20 hidden sm:block">Precio</div>
          <div className="px-2 py-3 font-medium w-10 hidden sm:block text-center" title="Destacado">
            <svg className="w-4 h-4 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <div className="px-4 py-3 font-medium w-24 hidden sm:block">Estado</div>
          <div className="px-4 py-3 font-medium w-24 text-right">Acciones</div>
        </div>

        {(() => {
          const featuredItems = filtered.filter(p => p.featured);
          const normalItems = filtered.filter(p => !p.featured);
          const rowProps = { categories, getImageById, onEdit: startEdit, onDelete: handleDelete, onToggleFeatured: toggleFeatured, confirmDelete, setConfirmDelete };

          if (isFiltering) {
            return [...featuredItems, ...normalItems].map(product => (
              <ProductRow key={product.id} product={product} {...rowProps} showGrip={false} />
            ));
          }

          return (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filtered.map(p => p.id)} strategy={verticalListSortingStrategy}>
                {featuredItems.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0.5}>
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      Destacados ({featuredItems.length})
                    </div>
                    {featuredItems.map(product => (
                      <SortableRow key={product.id} product={product} {...rowProps} />
                    ))}
                  </>
                )}
                {normalItems.length > 0 && featuredItems.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Resto de productos ({normalItems.length})
                  </div>
                )}
                {normalItems.map(product => (
                  <SortableRow key={product.id} product={product} {...rowProps} />
                ))}
              </SortableContext>
            </DndContext>
          );
        })()}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">No se encontraron productos</div>
        )}
      </div>
    </div>
  );
}
