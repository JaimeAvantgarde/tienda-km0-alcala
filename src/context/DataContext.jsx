import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { defaultCategories, defaultProducts, defaultSiteConfig } from '../data/sampleData';

const DataContext = createContext();

// ── Transformaciones snake_case ↔ camelCase ──────────────────────
function productFromDB(p) {
  return {
    ...p,
    shortDescription: p.short_description ?? p.shortDescription ?? '',
    longDescription: p.long_description ?? p.longDescription ?? '',
    categoryId: p.category_id ?? p.categoryId ?? '',
    imageIds: p.image_ids ?? p.imageIds ?? [],
  };
}

function productToDB(p) {
  return {
    id: p.id,
    name: p.name,
    short_description: p.shortDescription ?? p.short_description ?? '',
    long_description: p.longDescription ?? p.long_description ?? '',
    category_id: p.categoryId ?? p.category_id ?? '',
    image_ids: p.imageIds ?? p.image_ids ?? [],
    price: p.price ?? 0,
    producer: p.producer ?? '',
    origin: p.origin ?? '',
    tradition: p.tradition ?? '',
    visible: p.visible ?? true,
    featured: p.featured ?? false,
    order: p.order ?? 0,
  };
}

function categoryFromDB(c) {
  return {
    ...c,
    imageId: c.image_id ?? c.imageId ?? null,
  };
}

function categoryToDB(c) {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? '',
    icon: c.icon ?? '📦',
    gradient: c.gradient ?? '',
    order: c.order ?? 0,
    image_id: c.imageId ?? c.image_id ?? null,
  };
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);
  const [images, setImages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('km0_auth') || 'false')
  );
  const [loading, setLoading] = useState(true);

  // ── Carga inicial ────────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      const [
        { data: cats },
        { data: prods },
        { data: imgs },
        { data: config },
      ] = await Promise.all([
        supabase.from('categories').select('*').order('order'),
        supabase.from('products').select('*').order('order'),
        supabase.from('images').select('*').order('created_at'),
        supabase.from('site_config').select('*').eq('id', 1).single(),
      ]);

      setCategories((cats?.length ? cats : defaultCategories).map(categoryFromDB));
      setProducts((prods?.length ? prods : defaultProducts).map(productFromDB));
      setImages(imgs || []);
      if (config?.data) setSiteConfig(config.data);
      setLoading(false);
    }
    loadAll();
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    if (email === siteConfig.adminEmail && password === siteConfig.adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('km0_auth', 'true');
      return true;
    }
    return false;
  }, [siteConfig]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('km0_auth');
  }, []);

  // ── Products ─────────────────────────────────────────────────────
  const addProduct = useCallback(async (product) => {
    const newProduct = productFromDB({
      ...productToDB(product),
      id: 'prod_' + Date.now(),
      order: products.length,
    });
    await supabase.from('products').insert(productToDB(newProduct));
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, [products.length]);

  const updateProduct = useCallback(async (id, updates) => {
    const dbUpdates = productToDB({ ...updates, id });
    await supabase.from('products').update(dbUpdates).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productFromDB({ ...p, ...updates }) } : p));
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const reorderProducts = useCallback(async (fromIndex, toIndex) => {
    const updated = [...products];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const withOrder = updated.map((p, i) => ({ ...p, order: i }));
    setProducts(withOrder);
    await Promise.all(
      withOrder.map(p => supabase.from('products').update({ order: p.order }).eq('id', p.id))
    );
  }, [products]);

  // ── Categories ───────────────────────────────────────────────────
  const addCategory = useCallback(async (category) => {
    const newCat = categoryFromDB({
      ...categoryToDB(category),
      id: 'cat_' + Date.now(),
      order: categories.length,
    });
    await supabase.from('categories').insert(categoryToDB(newCat));
    setCategories(prev => [...prev, newCat]);
    return newCat;
  }, [categories.length]);

  const updateCategory = useCallback(async (id, updates) => {
    const dbUpdates = categoryToDB({ ...updates, id });
    await supabase.from('categories').update(dbUpdates).eq('id', id);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...categoryFromDB({ ...c, ...updates }) } : c));
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await supabase.from('categories').delete().eq('id', id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  // ── Images ───────────────────────────────────────────────────────
  const addImage = useCallback(async ({ name, storageUrl, storagePath }) => {
    const newImg = {
      id: 'img_' + Date.now(),
      name,
      url: storageUrl,
      storage_path: storagePath,
      created_at: new Date().toISOString(),
    };
    await supabase.from('images').insert(newImg);
    setImages(prev => [...prev, newImg]);
    return newImg;
  }, []);

  const deleteImage = useCallback(async (id) => {
    const img = images.find(i => i.id === id);
    if (img?.storage_path) {
      await supabase.storage.from('km0-images').remove([img.storage_path]);
    }
    await supabase.from('images').delete().eq('id', id);
    setImages(prev => prev.filter(i => i.id !== id));
    setProducts(prev => prev.map(p => ({
      ...p,
      imageIds: (p.imageIds || []).filter(imgId => imgId !== id),
    })));
    setCategories(prev => prev.map(c => ({
      ...c,
      imageId: c.imageId === id ? null : c.imageId,
    })));
  }, [images]);

  // ── Site Config ──────────────────────────────────────────────────
  const updateSiteConfig = useCallback(async (updates) => {
    const newConfig = { ...siteConfig, ...updates };
    await supabase.from('site_config').upsert({
      id: 1,
      data: newConfig,
      updated_at: new Date().toISOString(),
    });
    setSiteConfig(newConfig);
  }, [siteConfig]);

  // ── Helpers ──────────────────────────────────────────────────────
  // getImageById: los componentes buscan por id, la imagen tiene .data (base64) o .url (Storage)
  const getImageById = useCallback((id) => {
    const img = images.find(i => i.id === id);
    if (!img) return null;
    // Compatibilidad: componentes usan img.data, Storage usa img.url
    return { ...img, data: img.url ?? img.data };
  }, [images]);

  const getCategoryById = useCallback((id) => categories.find(c => c.id === id), [categories]);
  const getProductsByCategory = useCallback((categoryId) =>
    products.filter(p => p.categoryId === categoryId && p.visible), [products]);

  const visibleProducts = products.filter(p => p.visible);
  const sortedCategories = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const value = {
    products,
    visibleProducts,
    categories: sortedCategories,
    allCategories: categories,
    siteConfig,
    images,
    isAuthenticated,
    loading,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
    addCategory,
    updateCategory,
    deleteCategory,
    addImage,
    deleteImage,
    updateSiteConfig,
    getImageById,
    getCategoryById,
    getProductsByCategory,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
