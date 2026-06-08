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