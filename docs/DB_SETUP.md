# 🗄️ Configuración de Base de Datos — Surix App

Guía paso a paso para configurar el entorno de base de datos desde cero.

---

## Requisitos

- PostgreSQL 14 o superior
- pgAdmin 4 (recomendado) o cualquier cliente SQL
- Java 21+
- Maven 3.8+

---

## Paso 1 — Crear la base de datos

### Opción A — pgAdmin
1. Abre pgAdmin
2. Click derecho en **Databases** → **Create** → **Database**
3. Nombre: `mercado_db`
4. Click **Save**

### Opción B — psql (terminal)
```bash
psql -U postgres
CREATE DATABASE mercado_db;
\q
```

---

## Paso 2 — Configurar credenciales

Crea el archivo `src/main/resources/application-local.properties`:

```properties
DB_URL=jdbc:postgresql://localhost:5432/mercado_db
DB_USERNAME=postgres
DB_PASSWORD=tu_password_aqui
```

> ⚠️ Este archivo está en `.gitignore` — nunca se sube a GitHub.

---

## Paso 3 — Correr la app por primera vez

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Hibernate creará todas las tablas automáticamente gracias a `ddl-auto=update`.

Verifica en pgAdmin que existan estas tablas:
- `usuarios`
- `roles`
- `usuarios_roles`
- `estantes`
- `categoria`
- `productos`
- `listas_compra`
- `items_lista`

---

## Paso 4 — Ejecutar el script de configuración

Una vez que las tablas existen, ejecuta el archivo `docs/setup.sql`.

### En pgAdmin:
1. Selecciona la base de datos `mercado_db`
2. Click en **Query Tool** (ícono de lápiz)
3. Abre el archivo `docs/setup.sql`
4. **No ejecutes todo de una** — lee las instrucciones de cada sección
5. Ejecuta **solo las secciones 2, 3, 4 y 5** (la sección 1 ya la hiciste)

### En psql:
```bash
psql -U postgres -d mercado_db -f docs/setup.sql
```

> ⚠️ Si ejecutas desde psql omite el `CREATE DATABASE` del paso 1 del script.

---

## Paso 5 — Verificar índices

Después de ejecutar el script, verifica que los índices se crearon:

```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE indexname LIKE 'idx_%'
ORDER BY tablename;
```

Deberías ver:

| indexname | tablename |
|---|---|
| idx_categoria_nombre_lower | categoria |
| idx_estantes_nombre_lower | estantes |
| idx_estantes_orden_logico | estantes |
| idx_productos_nombre_lower | productos |
| idx_usuarios_username_lower | usuarios |

---

## Paso 6 — Verificar datos iniciales

```sql
SELECT * FROM roles;
```

Debe mostrar:

| id | nombre |
|---|---|
| 1 | ADMIN |
| 2 | CLIENTE |

Si no aparecen, insértalos manualmente:
```sql
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('CLIENTE');
```

---

## Paso 7 — Crear usuario administrador inicial

Con la app corriendo, usa Thunder Client o Postman:

```
POST http://localhost:8080/api/usuarios
{
    "username": "admin",
    "password": "admin123"
}
```

Luego asigna el rol ADMIN (usa el id del usuario creado):
```
POST http://localhost:8080/api/usuarios/1/roles/1
```

---

## Resumen de comandos

```bash
# 1. Clonar el repo
git clone https://github.com/tuusuario/surix-app.git
cd surix-app/backend-spring

# 2. Crear application-local.properties con tus credenciales

# 3. Correr la app (crea las tablas)
mvn spring-boot:run -Dspring-boot.run.profiles=local

# 4. Ejecutar el script SQL en pgAdmin

# 5. Verificar que todo funciona
# GET http://localhost:8080/api/roles → debe devolver ADMIN y CLIENTE
```

---

## Estructura del proyecto

```
surix-app/
├── backend-spring/          ← Spring Boot API
│   ├── src/
│   ├── docs/
│   │   └── setup.sql       ← este script
│   └── pom.xml
└── surix-frontend/          ← Next.js frontend
    ├── src/
    └── package.json
```

---

## Solución de problemas comunes

**Error: `password authentication failed`**
→ Verifica que el password en `application-local.properties` sea correcto.

**Error: `database "mercado_db" does not exist`**
→ Crea la base de datos siguiendo el Paso 1.

**Error: `relation "estantes" does not exist` al ejecutar el script**
→ Corre la app primero (Paso 3) para que Hibernate cree las tablas.

**Los índices no aparecen**
→ Verifica que estés conectado a `mercado_db` y no a otra base de datos.

**Error: `duplicate key value violates unique constraint`**
→ Ya hay datos duplicados en la BD. Límpiala o elimina los duplicados antes de crear los índices.