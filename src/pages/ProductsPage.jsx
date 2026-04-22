import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const { visibleProducts, categories, categoryFilters } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('categoria') || 'all';
  const activeCategoryObj = categories.find(c => c.id === activeCategory);
  useSEO({
    title: activeCategoryObj ? activeCategoryObj.name : 'Productos',
    description: activeCategoryObj
      ? `${activeCategoryObj.description} Productos artesanales de Alcalá la Real, Sierra Sur de Jaén.`
      : 'Catálogo completo de productos locales de Alcalá la Real: aceite de oliva, quesos, embutidos, dulces, conservas y souvenirs de la Sierra Sur de Jaén.',
    path: '/productos',
  });
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const setCategory = (catId) => {
    setActiveTag('');
    setSearchParams(catId === 'all' ? {} : { categoria: catId });
  };

  // Filtros predefinidos de la categoría activa (gestionados desde el admin)
  const predefinedFilters = useMemo(() => {
    if (activeCategory === 'all') return [];
    return [...categoryFilters]
      .filter(f => f.category_id === activeCategory)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categoryFilters, activeCategory]);

  // Tags libres de productos (solo para categorías sin filtros predefinidos)
  const availableTags = useMemo(() => {
    if (activeCategory === 'all' || predefinedFilters.length > 0) return [];
    const tags = new Set();
    visibleProducts
      .filter(p => p.categoryId === activeCategory)
      .forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return [...tags].sort();
  }, [visibleProducts, activeCategory, predefinedFilters]);

  // Unión de filtros a mostrar: predefinidos primero, luego tags libres
  const displayFilters = predefinedFilters.length > 0
    ? predefinedFilters.map(f => f.name)
    : availableTags;

  const filtered = useMemo(() => {
    let result = visibleProducts;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.categoryId === activeCategory);
    }
    if (activeTag) {
      result = result.filter(p => (p.tags || []).includes(activeTag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [visibleProducts, activeCategory, activeTag, search]);

  return (
    <div className="min-h-screen bg-crema">
      {/* Header */}
      <div className="bg-gradient-to-br from-oliva-700 to-oliva-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Nuestros Productos
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Descubre el catálogo completo de productos locales de Alcalá la Real
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tierra-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-tierra-200 bg-white text-tierra-800 placeholder:text-tierra-400 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-oliva-500 text-white'
                : 'bg-white text-tierra-600 hover:bg-tierra-100 border border-tierra-200'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-oliva-500 text-white'
                  : 'bg-white text-tierra-600 hover:bg-tierra-100 border border-tierra-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtros de categoría (predefinidos o tags libres) */}
        {displayFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pl-1">
            <span className="text-xs text-tierra-400 self-center mr-1">Filtrar:</span>
            {displayFilters.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTag === tag
                    ? 'bg-terracota-500 text-white'
                    : 'bg-white text-tierra-600 hover:bg-tierra-100 border border-tierra-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        {displayFilters.length === 0 && <div className="mb-8" />}

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-tierra-500 text-lg">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
