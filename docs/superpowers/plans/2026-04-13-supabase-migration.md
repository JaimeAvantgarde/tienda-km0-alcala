# Supabase Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar el DataContext de localStorage a Supabase para que los cambios del admin sean visibles para todos los visitantes en tiempo real.

**Architecture:** Se crea un cliente Supabase centralizado en `src/lib/supabase.js`. El DataContext se reescribe para hacer operaciones async contra Supabase (tablas: products, categories, site_config, images). Las imágenes dejan de ser base64 en localStorage y pasan a Supabase Storage con URL pública.

**Tech Stack:** React 19, Vite 8, Supabase JS v2, Supabase Storage, Tailwind 4

---

## File Map

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Crear | `src/lib/supabase.js` | Cliente Supabase singleton |
| Crear | `.env.local` | SUPABASE_URL + SUPABASE_ANON_KEY |
| Crear | `supabase/schema.sql` | DDL completo + RLS + Storage bucket |
| Modificar | `src/context/DataContext.jsx` | Reemplazar localStorage → Supabase async |
| Modificar | `src/pages/admin/ImagesAdmin.jsx` | Upload a Storage en vez de base64 |
| Modificar | `src/main.jsx` | Añadir loader mientras DataContext hidrata |

---

## Task 1: Credenciales y cliente Supabase

**Files:**
- Create: `.env.local`
- Create: `src/lib/supabase.js`

- [ ] **Paso 1: Crear proyecto Supabase**

  1. Ir a https://supabase.com → New project
  2. Nombre: `tienda-km0-alcala`, región: EU West (Ireland)
  3. Copiar `Project URL` y `anon public key` de Settings → API

- [ ] **Paso 2: Crear `.env.local`**

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

- [ ] **Paso 3: Crear `src/lib/supabase.js`**

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Paso 4: Instalar dependencia**

```bash
cd /Users/jaimeparejaarco/Desktop/tienda-km0-alcala
npm install @supabase/supabase-js
```

---

## Task 2: Schema SQL en Supabase

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Paso 1: Crear `supabase/schema.sql`**

```sql
-- IMAGES (metadata; archivos en Storage)
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '📦',
  gradient TEXT DEFAULT 'from-gray-100 to-gray-200',
  "order" INTEGER DEFAULT 0,
  image_id TEXT REFERENCES images(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  image_ids TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) DEFAULT 0,
  producer TEXT DEFAULT '',
  origin TEXT DEFAULT '',
  tradition TEXT DEFAULT '',
  visible BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE CONFIG (fila única, id siempre = 1)
CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: lectura pública, escritura desde anon (la seguridad admin es a nivel de app)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_images"      ON images      FOR SELECT USING (true);
CREATE POLICY "anon_write_images"       ON images      FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "public_read_categories"  ON categories  FOR SELECT USING (true);
CREATE POLICY "anon_write_categories"   ON categories  FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "public_read_products"    ON products    FOR SELECT USING (true);
CREATE POLICY "anon_write_products"     ON products    FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "public_read_config"      ON site_config FOR SELECT USING (true);
CREATE POLICY "anon_write_config"       ON site_config FOR ALL    USING (true) WITH CHECK (true);
```

- [ ] **Paso 2: Ejecutar SQL en Supabase**

  Ir a Supabase → SQL Editor → pegar el contenido del archivo → Run

- [ ] **Paso 3: Crear Storage bucket**

  Supabase → Storage → New bucket
  - Nombre: `km0-images`
  - Public bucket: **ON** (para que las URLs sean públicas)

- [ ] **Paso 4: Añadir policy al bucket (Storage → Policies)**

```sql
-- Lectura pública
CREATE POLICY "public read km0-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'km0-images');

-- Escritura anon
CREATE POLICY "anon write km0-images"
ON storage.objects FOR ALL
USING (bucket_id = 'km0-images')
WITH CHECK (bucket_id = 'km0-images');
```

- [ ] **Paso 5: Seed datos iniciales**

  Supabase → SQL Editor → ejecutar INSERT con los datos de `src/data/sampleData.js`:

```sql
-- Site config inicial
INSERT INTO site_config (id, data) VALUES (1, '{
  "siteName": "Tienda Km0",
  "fullName": "Tienda Km0 Alcalá la Real",
  "bannerMessage": "Descubre los sabores auténticos de Alcalá la Real",
  "phone": "",
  "email": "",
  "whatsapp": "",
  "address": "Alcalá la Real, Jaén",
  "mapLat": 37.4639359,
  "mapLng": -3.9237464,
  "instagram": "",
  "facebook": "",
  "schedule": "Lunes a Viernes: 9:00 - 14:00 y 17:00 - 20:30\nSábados: 9:00 - 14:00",
  "aboutTitle": "Nuestra Tierra, Nuestros Productos",
  "aboutText": "Alcalá la Real...",
  "adminEmail": "admin@tiendakm0.es",
  "adminPassword": "km0alcala2024"
}');

-- Categories (ejecutar cada INSERT)
INSERT INTO categories (id, name, description, icon, gradient, "order") VALUES
('cat_aceite',   'Aceite de Oliva',         'El oro líquido de la Sierra Sur de Jaén.',                    '🫒', 'from-oliva-200 to-tierra-100',     1),
('cat_quesos',   'Quesos',                  'Quesos artesanales de cabra y oveja.',                         '🧀', 'from-tierra-100 to-crema-dark',    2),
('cat_embutidos','Embutidos',               'Chacinas y embutidos curados.',                                '🥩', 'from-terracota-100 to-tierra-200', 3),
('cat_dulces',   'Dulces y Repostería',     'Dulces tradicionales de Alcalá la Real.',                     '🍪', 'from-tierra-200 to-terracota-100', 4),
('cat_vinos',    'Vinos y Licores',         'Vinos y licores artesanales.',                                 '🍷', 'from-terracota-200 to-oliva-100',  5),
('cat_conservas','Conservas y Encurtidos',  'Aceitunas, mermeladas y conservas artesanales.',               '🫙', 'from-oliva-100 to-tierra-200',     6);
```

---

## Task 3: Reescribir DataContext

**Files:**
- Modify: `src/context/DataContext.jsx`

- [ ] **Paso 1: Reemplazar DataContext completo**

```jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { defaultCategories, defaultProducts, defaultSiteConfig } from '../data/sampleData';

const DataContext = createContext();

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

      setCategories(cats || defaultCategories);
      setProducts(prods || defaultProducts);
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
    const newProduct = { ...product, id: 'prod_' + Date.now(), order: products.length };
    await supabase.from('products').insert(newProduct);
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, [products.length]);

  const updateProduct = useCallback(async (id, updates) => {
    await supabase.from('products').update(updates).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
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
    const newCat = { ...category, id: 'cat_' + Date.now(), order: categories.length };
    await supabase.from('categories').insert(newCat);
    setCategories(prev => [...prev, newCat]);
    return newCat;
  }, [categories.length]);

  const updateCategory = useCallback(async (id, updates) => {
    await supabase.from('categories').update(updates).eq('id', id);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await supabase.from('categories').delete().eq('id', id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  // ── Images ───────────────────────────────────────────────────────
  const addImage = useCallback(async ({ name, file, storageUrl, storagePath }) => {
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
    // Limpiar referencias en productos y categorías
    setProducts(prev => prev.map(p => ({
      ...p,
      image_ids: (p.image_ids || []).filter(imgId => imgId !== id),
    })));
    setCategories(prev => prev.map(c => ({
      ...c,
      image_id: c.image_id === id ? null : c.image_id,
    })));
  }, [images]);

  // ── Site Config ──────────────────────────────────────────────────
  const updateSiteConfig = useCallback(async (updates) => {
    const newConfig = { ...siteConfig, ...updates };
    await supabase.from('site_config').upsert({ id: 1, data: newConfig, updated_at: new Date().toISOString() });
    setSiteConfig(newConfig);
  }, [siteConfig]);

  // ── Helpers ──────────────────────────────────────────────────────
  const getImageById = useCallback((id) => images.find(i => i.id === id), [images]);
  const getCategoryById = useCallback((id) => categories.find(c => c.id === id), [categories]);
  const getProductsByCategory = useCallback((categoryId) =>
    products.filter(p => p.category_id === categoryId && p.visible), [products]);

  const visibleProducts = products.filter(p => p.visible);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const value = {
    products, visibleProducts,
    categories: sortedCategories, allCategories: categories,
    siteConfig, images, isAuthenticated, loading,
    login, logout,
    addProduct, updateProduct, deleteProduct, reorderProducts,
    addCategory, updateCategory, deleteCategory,
    addImage, deleteImage,
    updateSiteConfig,
    getImageById, getCategoryById, getProductsByCategory,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
```

- [ ] **Paso 2: Verificar que el campo es `image_ids` (no `imageIds`)**

  Supabase usa snake_case. Hay que unificar en todo el proyecto:
  - `imageIds` → `image_ids`
  - `categoryId` → `category_id`

  Buscar y reemplazar en todos los archivos de `src/`.

---

## Task 4: Actualizar ImagesAdmin para Supabase Storage

**Files:**
- Modify: `src/pages/admin/ImagesAdmin.jsx`

- [ ] **Paso 1: Reemplazar `processFiles` para subir a Storage**

```jsx
import { supabase } from '../../lib/supabase';

const processFiles = (files) => {
  Array.from(files).forEach(async (file) => {
    if (!file.type.startsWith('image/')) return;

    // Redimensionar igual que antes
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
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

        // Blob para subir a Storage
        canvas.toBlob(async (blob) => {
          const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
          const storagePath = fileName;

          const { error } = await supabase.storage
            .from('km0-images')
            .upload(storagePath, blob, { contentType: 'image/jpeg', upsert: false });

          if (error) { console.error('Upload error:', error); return; }

          const { data: { publicUrl } } = supabase.storage
            .from('km0-images')
            .getPublicUrl(storagePath);

          await addImage({ name: file.name, storageUrl: publicUrl, storagePath });
        }, 'image/jpeg', 0.85);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
```

- [ ] **Paso 2: Actualizar referencia de `img.data` → `img.url` en la galería**

```jsx
// Antes:
<img src={img.data} alt={img.name} ... />

// Después:
<img src={img.url} alt={img.name} ... />
```

---

## Task 5: Normalizar campos snake_case

Los campos que cambian de camelCase a snake_case:

| Antes (localStorage) | Después (Supabase) |
|---------------------|-------------------|
| `imageIds` | `image_ids` |
| `categoryId` | `category_id` |
| `imageId` | `image_id` |

- [ ] **Paso 1: Buscar y reemplazar en todos los componentes**

```bash
# Archivos que referencian imageIds:
grep -r "imageIds\|categoryId\|imageId" src/ --include="*.jsx" -l
```

Archivos afectados esperados:
- `src/pages/admin/ProductsAdmin.jsx`
- `src/pages/admin/CategoriesAdmin.jsx`
- `src/components/ProductCard.jsx`
- `src/pages/ProductDetailPage.jsx`
- `src/pages/HomePage.jsx`
- `src/components/CategoryGrid.jsx`

- [ ] **Paso 2: En cada archivo, reemplazar los nombres de campo**

---

## Task 6: Loading state en main.jsx

**Files:**
- Modify: `src/main.jsx` o `src/App.jsx`

- [ ] **Paso 1: Añadir spinner mientras carga Supabase**

En `src/App.jsx`, usar el `loading` del contexto:

```jsx
import { useData } from './context/DataContext';

// Dentro de App(), ANTES del return principal:
const { loading } = useData();
if (loading) return (
  <div className="min-h-screen flex items-center justify-center bg-crema">
    <div className="text-center">
      <div className="w-10 h-10 border-4 border-oliva-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-tierra-600 text-sm">Cargando...</p>
    </div>
  </div>
);
```

Pero `useData()` no puede llamarse en `App` si `App` está fuera del `DataProvider`. Verificar el árbol en `main.jsx` — el spinner debe ir en un componente hijo del provider.

---

## Task 7: Verificación final

- [ ] **Paso 1: Arrancar dev server y verificar**

```bash
npm run dev
```

Comprobar:
1. Web pública carga productos/categorías desde Supabase
2. Login en `/admin/login` funciona
3. Crear un producto desde el admin → verificar que aparece en tabla Supabase
4. Subir una imagen → verificar que aparece en Storage bucket
5. Editar site config → verificar en tabla site_config
6. Abrir en otro navegador/incógnito → los cambios son visibles

- [ ] **Paso 2: Commit**

```bash
git add -A
git commit -m "feat: migrar de localStorage a Supabase"
```

---

## Notas importantes

- Las imágenes antiguas de localStorage se perderán (era base64 efímero, no hay forma de migrarlas a Storage sin que el admin las vuelva a subir)
- El campo `img.data` (base64) desaparece; pasa a ser `img.url` (URL pública de Storage)
- Las credenciales admin siguen siendo las mismas: `admin@tiendakm0.es` / `km0alcala2024`
- `.env.local` NO debe commitearse (añadir a `.gitignore`)
