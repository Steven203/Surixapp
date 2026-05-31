-- ============================================================
-- SURIX APP — Script de configuración de base de datos
-- Motor: PostgreSQL 14+
-- Última actualización: 2026
-- ============================================================
-- INSTRUCCIONES:
-- 1. Crear la base de datos primero (ver paso 1 abajo)
-- 2. Correr la app una vez con ddl-auto=update para que
--    Hibernate cree las tablas automáticamente
-- 3. Luego ejecutar SOLO la sección de índices y constraints
--    (sección 2 en adelante)
-- ============================================================


-- ============================================================
-- PASO 1 — Crear la base de datos
-- Ejecutar conectado a postgres (base por defecto)
-- ============================================================

CREATE DATABASE mercado_db;

-- Conectarse a mercado_db antes de continuar
-- En psql: \c mercado_db
-- En pgAdmin: seleccionar mercado_db como base activa


-- ============================================================
-- PASO 2 — Índices únicos case-insensitive
-- Ejecutar DESPUÉS de correr la app al menos una vez
-- para que Hibernate haya creado las tablas
-- ============================================================

-- Estantes: nombre único sin importar mayúsculas y espacios
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


-- ============================================================
-- PASO 3 — Verificar que los índices se crearon correctamente
-- ============================================================

SELECT
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE tablename IN ('estantes', 'categoria', 'productos', 'usuarios')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;


-- ============================================================
-- PASO 4 — Datos iniciales (roles base)
-- Insertar solo si no existen
-- ============================================================

INSERT INTO roles (nombre)
SELECT 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'ADMIN');

INSERT INTO roles (nombre)
SELECT 'CLIENTE'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'CLIENTE');


-- ============================================================
-- PASO 5 — Verificar estructura final de tablas
-- ============================================================

-- Ver columnas de cada tabla
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'usuarios', 'roles', 'usuarios_roles',
    'estantes', 'categoria', 'productos',
    'listas_compra', 'items_lista'
  )
ORDER BY table_name, ordinal_position;