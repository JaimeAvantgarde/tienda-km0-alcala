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

-- RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_images"     ON images      FOR SELECT USING (true);
CREATE POLICY "anon_write_images"      ON images      FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "public_read_categories" ON categories  FOR SELECT USING (true);
CREATE POLICY "anon_write_categories"  ON categories  FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "public_read_products"   ON products    FOR SELECT USING (true);
CREATE POLICY "anon_write_products"    ON products    FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "public_read_config"     ON site_config FOR SELECT USING (true);
CREATE POLICY "anon_write_config"      ON site_config FOR ALL    USING (true) WITH CHECK (true);

-- SEED: Site config inicial
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
  "aboutText": "Alcalá la Real, en el corazón de la Sierra Sur de Jaén, es tierra de olivos centenarios, de sierras verdes y de una tradición gastronómica que se pierde en el tiempo. Desde la época de Al-Ándalus, esta tierra ha sido cruce de culturas y sabores.\n\nEn Tienda Km0 reunimos lo mejor de nuestra comarca: el aceite de oliva virgen extra que es nuestro oro líquido, los quesos artesanales de cabra payoya, los embutidos curados en la sierra, los dulces que endulzan nuestras fiestas y las conservas que guardan el sabor de cada estación.\n\nCada producto que encontrarás aquí tiene nombre y apellidos. Conocemos a cada productor, cada finca, cada obrador. Porque creemos que lo bueno está cerca, y que apoyar lo local es apostar por nuestra tierra y nuestra gente.\n\nVen a descubrir los sabores de Alcalá la Real. Aquí no vendemos productos, compartimos tradición.",
  "adminEmail": "admin@tiendakm0.es",
  "adminPassword": "km0alcala2024"
}') ON CONFLICT (id) DO NOTHING;

-- SEED: Categorías
INSERT INTO categories (id, name, description, icon, gradient, "order") VALUES
  ('cat_aceite',    'Aceite de Oliva',        'El oro líquido de la Sierra Sur de Jaén. Aceites de oliva virgen extra de variedades autóctonas.', '🫒', 'from-oliva-200 to-tierra-100',     1),
  ('cat_quesos',    'Quesos',                 'Quesos artesanales de cabra y oveja elaborados con leche de ganaderías locales.',                   '🧀', 'from-tierra-100 to-crema-dark',    2),
  ('cat_embutidos', 'Embutidos',              'Chacinas y embutidos curados según la tradición de la sierra jienense.',                            '🥩', 'from-terracota-100 to-tierra-200', 3),
  ('cat_dulces',    'Dulces y Repostería',    'Dulces tradicionales de Alcalá la Real con recetas heredadas de generación en generación.',         '🍪', 'from-tierra-200 to-terracota-100', 4),
  ('cat_vinos',     'Vinos y Licores',        'Vinos y licores artesanales de la Sierra Sur de Jaén.',                                             '🍷', 'from-terracota-200 to-oliva-100',  5),
  ('cat_conservas', 'Conservas y Encurtidos', 'Aceitunas de mesa, mermeladas y conservas elaboradas de forma artesanal.',                          '🫙', 'from-oliva-100 to-tierra-200',     6)
ON CONFLICT (id) DO NOTHING;

-- SEED: Productos
INSERT INTO products (id, name, short_description, long_description, category_id, image_ids, price, producer, origin, tradition, visible, "order") VALUES
  ('prod_1',  'AOVE Picual Sierra Sur',      'Aceite de oliva virgen extra de variedad Picual, prensado en frío.',                  'Nuestro aceite de oliva virgen extra de variedad Picual es el producto estrella de la Sierra Sur de Jaén.',                           'cat_aceite',    '{}', 12.90, 'Cooperativa Sierra Sur',          'Alcalá la Real, Jaén',  'La producción de aceite en Alcalá la Real se remonta a la época romana.',             true, 0),
  ('prod_2',  'AOVE Hojiblanca Temprano',    'Aceite de cosecha temprana con notas frescas y ligeramente picante.',                 'Aceite de oliva virgen extra de variedad Hojiblanca, recolectado en verde durante los primeros días de campaña.',                   'cat_aceite',    '{}', 14.50, 'Almazara Artesanal El Castillo',  'Alcalá la Real, Jaén',  'La almazara El Castillo lleva tres generaciones produciendo aceite.',                  true, 1),
  ('prod_3',  'Queso de Cabra Curado',       'Queso curado de cabra payoya con corteza natural.',                                   'Queso elaborado con leche cruda de cabra payoya, raza autóctona de las sierras andaluzas.',                                        'cat_quesos',    '{}',  9.75, 'Quesería La Martina',            'Sierra Sur de Jaén',    'La familia Martín lleva elaborando quesos artesanales desde los años 60.',             true, 2),
  ('prod_4',  'Queso Semicurado en Aceite',  'Queso semicurado de cabra conservado en AOVE de la zona.',                           'Un queso semicurado de textura cremosa y sabor suave, sumergido en aceite de oliva virgen extra Picual.',                           'cat_quesos',    '{}', 11.50, 'Quesería La Martina',            'Sierra Sur de Jaén',    'La conservación de queso en aceite es una práctica centenaria en la zona.',            true, 3),
  ('prod_5',  'Chorizo Casero de Alcalá',    'Chorizo artesanal curado con pimentón de la Vera y especias naturales.',             'Chorizo elaborado de forma artesanal siguiendo la receta tradicional alcalaína.',                                                    'cat_embutidos', '{}',  7.90, 'Embutidos Artesanos Sierra',     'Alcalá la Real, Jaén',  'La matanza del cerdo ha sido durante siglos un evento familiar en Alcalá la Real.',   true, 4),
  ('prod_6',  'Morcilla de la Sierra',       'Morcilla tradicional con arroz, cebolla y especias de la sierra.',                   'Morcilla elaborada según la receta tradicional serrana.',                                                                          'cat_embutidos', '{}',  6.50, 'Embutidos Artesanos Sierra',     'Sierra Sur de Jaén',    'Receta transmitida de madres a hijas durante generaciones.',                           true, 5),
  ('prod_7',  'Roscos de Alcalá la Real',    'Roscos fritos tradicionales bañados en azúcar, típicos de Semana Santa.',            'Los roscos de Alcalá la Real son uno de los dulces más emblemáticos del pueblo.',                                                   'cat_dulces',    '{}',  4.50, 'Obrador La Abuela Carmen',       'Alcalá la Real, Jaén',  'Los roscos forman parte de la tradición dulcera de Alcalá la Real desde hace siglos.', true, 6),
  ('prod_8',  'Pestiños Artesanales',        'Pestiños de masa fina con ajonjolí, bañados en miel de la sierra.',                  'Pestiños elaborados artesanalmente con masa de harina, aceite de oliva y un toque de anís y canela.',                               'cat_dulces',    '{}',  5.25, 'Obrador La Abuela Carmen',       'Alcalá la Real, Jaén',  'Los pestiños tienen raíces árabes y son parte del legado culinario andalusí.',        true, 7),
  ('prod_9',  'Vino Tinto Sierra Sur',       'Vino tinto joven de uvas cultivadas en las laderas de la Sierra Sur.',               'Vino tinto elaborado con uvas de las variedades Tempranillo y Garnacha.',                                                          'cat_vinos',     '{}',  8.90, 'Bodega Artesanal La Fortaleza', 'Sierra Sur de Jaén',    'La viticultura tiene una larga tradición en la Sierra Sur.',                           true, 8),
  ('prod_10', 'Aceitunas de Mesa Gordal',    'Aceitunas gordal aliñadas con hierbas aromáticas de la sierra.',                     'Aceitunas de la variedad Gordal, seleccionadas a mano y aliñadas según la receta tradicional alcalaína.',                           'cat_conservas', '{}',  3.90, 'Conservas Artesanas del Sur',    'Alcalá la Real, Jaén',  'El aliño de aceitunas es un ritual que se repite cada otoño en los hogares alcalaínos.', true, 9),
  ('prod_11', 'Mermelada de Higo',           'Mermelada artesanal de higos maduros recogidos a mano.',                             'Mermelada elaborada con higos maduros de las higueras de la zona.',                                                                'cat_conservas', '{}',  4.75, 'Conservas Artesanas del Sur',    'Sierra Sur de Jaén',    'La elaboración de mermeladas ha sido históricamente una forma de conservar la fruta.', true, 10),
  ('prod_12', 'Mistela Artesanal',           'Licor dulce tradicional elaborado con mosto de uva y aguardiente.',                  'La mistela es un licor dulce típico de la zona, elaborado mezclando mosto fresco de uva con aguardiente de orujo.',               'cat_vinos',     '{}', 10.50, 'Bodega Artesanal La Fortaleza', 'Alcalá la Real, Jaén',  'La elaboración de mistela es una costumbre ancestral en los pueblos de la Sierra Sur.', true, 11)
ON CONFLICT (id) DO NOTHING;
