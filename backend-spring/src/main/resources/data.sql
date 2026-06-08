CREATE UNIQUE INDEX IF NOT EXISTS idx_estantes_nombre_lower
    ON estantes (LOWER(TRIM(nombre)));

-- Estantes: orden lógico único
CREATE UNIQUE INDEX IF NOT EXISTS idx_estantes_orden_logico
    ON estantes (orden_logico);

-- Categorías: nombre único sin importar mayúsculas y espacios
CREATE UNIQUE INDEX IF NOT EXISTS idx_categoria_nombre_lower
    ON categoria (LOWER(TRIM(nombre)));

-- Productos: nombre único sin importar mayúsculas y espacios
CREATE UNIQUE INDEX IF NOT EXISTS idx_productos_nombre_lower
    ON productos (LOWER(TRIM(nombre)));

-- Usuarios: username único sin importar mayúsculas y espacios
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_username_lower
    ON usuarios (LOWER(TRIM(username)));
