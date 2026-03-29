import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultCategories, defaultProducts, defaultSiteConfig } from '../data/sampleData';

const DataContext = createContext();

const KEYS = {
  products: 'km0_products',
  categories: 'km0_categories',
  siteConfig: 'km0_siteConfig',
  images: 'km0_images',
  auth: 'km0_auth',
};

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => loadFromStorage(KEYS.products, defaultProducts));
  const [categories, setCategories] = useState(() => loadFromStorage(KEYS.categories, defaultCategories));
  const [siteConfig, setSiteConfig] = useState(() => loadFromStorage(KEYS.siteConfig, defaultSiteConfig));
  const [images, setImages] = useState(() => loadFromStorage(KEYS.images, []));
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadFromStorage(KEYS.auth, false));

  useEffect(() => saveToStorage(KEYS.products, products), [products]);
  useEffect(() => saveToStorage(KEYS.categories, categories), [categories]);
  useEffect(() => saveToStorage(KEYS.siteConfig, siteConfig), [siteConfig]);
  useEffect(() => saveToStorage(KEYS.images, images), [images]);
  useEffect(() => saveToStorage(KEYS.auth, isAuthenticated), [isAuthenticated]);

  const login = useCallback((email, password) => {
    if (email === siteConfig.adminEmail && password === siteConfig.adminPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [siteConfig]);

  const logout = useCallback(() => setIsAuthenticated(false), []);

  const addProduct = useCallback((product) => {
    const newProduct = { ...product, id: 'prod_' + Date.now() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addCategory = useCallback((category) => {
    const newCat = { ...category, id: 'cat_' + Date.now() };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  }, []);

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const addImage = useCallback((image) => {
    const newImg = { ...image, id: 'img_' + Date.now(), createdAt: new Date().toISOString() };
    setImages(prev => [...prev, newImg]);
    return newImg;
  }, []);

  const deleteImage = useCallback((id) => {
    setImages(prev => prev.filter(i => i.id !== id));
    setProducts(prev => prev.map(p => ({
      ...p,
      imageIds: p.imageIds.filter(imgId => imgId !== id),
    })));
    setCategories(prev => prev.map(c => ({
      ...c,
      imageId: c.imageId === id ? null : c.imageId,
    })));
  }, []);

  const updateSiteConfig = useCallback((updates) => {
    setSiteConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const getImageById = useCallback((id) => {
    return images.find(i => i.id === id);
  }, [images]);

  const getCategoryById = useCallback((id) => {
    return categories.find(c => c.id === id);
  }, [categories]);

  const getProductsByCategory = useCallback((categoryId) => {
    return products.filter(p => p.categoryId === categoryId && p.visible);
  }, [products]);

  const visibleProducts = products.filter(p => p.visible);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const value = {
    products,
    visibleProducts,
    categories: sortedCategories,
    allCategories: categories,
    siteConfig,
    images,
    isAuthenticated,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
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
