# backend-spring

Spring Boot backend para la aplicación `mercado`.

## Requisitos
- Java 21
- Maven 3.9+
- PostgreSQL 14+

## Configuración de entorno local
1. Copia el archivo de ejemplo:
   ```powershell
   copy .env.example .env.local
   ```
2. Ajusta los valores de conexión en `backend-spring/.env.local`.

## Ejemplo de variables de entorno
El backend lee estas variables desde el entorno:

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mercado_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=secret
```

## Ejecución
- Windows: `mvnw.cmd spring-boot:run`
- Linux/macOS: `./mvnw spring-boot:run`

## Build
```bash
./mvnw clean package
java -jar target/mercado-0.0.1-SNAPSHOT.jar
```

## Notas
- `backend-spring/.env.local` debe permanecer fuera del control de versiones.
- `backend-spring/.env.example` se usa como plantilla para crear el archivo local.
- Para desarrollo local, puedes mantener `spring.jpa.hibernate.ddl-auto=update` si quieres que Hibernate actualice el esquema automáticamente.

# 🛒 Mercado API — Backend

API REST para la gestión de un supermercado con lista de compras y ruta sugerida por estantes.

---

## Arquitectura

El proyecto sigue una arquitectura en capas estricta:

```
Controller → Service → Repository → Entity → PostgreSQL
```

| Capa | Paquete | Responsabilidad |
|---|---|---|
| Controller | `controller/` | Recibe HTTP, delega al service, devuelve respuesta |
| Service | `service/` + `service/impl/` | Lógica de negocio y validaciones |
| Repository | `repository/` | Acceso a datos vía JPA |
| Entity | `entity/` | Mapeo de tablas con anotaciones JPA |
| DTO | `dto/` | Objetos de entrada (Request) y salida (Response) |
| Exception | `exception/` | Manejo centralizado de errores |

```
src/main/java/com/surixapp/mercado/
├── controller/
│   ├── CategoriaController.java
│   ├── EstanteController.java
│   ├── ListaCompraController.java
│   ├── ProductoController.java
│   ├── RoleController.java
│   └── UsuarioController.java
├── dto/
│   ├── request/   (CreateXxxRequest, UpdateXxxRequest)
│   └── response/  (XxxResponse)
├── entity/
│   ├── Categoria.java
│   ├── Estante.java
│   ├── ItemLista.java
│   ├── ListaCompra.java
│   ├── Producto.java
│   ├── Role.java
│   └── Usuario.java
├── exception/
│   ├── BusinessException.java
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
|   |__ ApiError.java
├── repository/
└── service/
    └── impl/
```

---

## Base de datos

**Motor:** PostgreSQL  
**Nombre:** `mercado_db`

### Tablas y relaciones

```
usuarios ──────────────────── usuarios_roles ──── roles
    │                              (tabla puente ManyToMany)
    │ 1:N
    ▼
listas_compra
    │ 1:N
    ▼
items_lista ──── ManyToOne ──── productos ──── ManyToOne ──── estantes
                                    │
                                    └── ManyToOne ──── categoria
```

| Tabla | Columnas clave |
|---|---|
| `usuarios` | id, username, password |
| `roles` | id, nombre |
| `usuarios_roles` | usuario_id (FK), rol_id (FK) |
| `estantes` | id, nombre, coord_x, coord_y, orden_logico |
| `categoria` | id, nombre, descripcion |
| `productos` | id, nombre, precio, stock, descripcion, estante_id (FK), categoria_id (FK) |
| `listas_compra` | id, usuario_id (FK), estado |
| `items_lista` | id, lista_id (FK), producto_id (FK), cantidad, recogido | snaphots


## Endpoints

### Roles — `/api/roles`

| Método | URL | Body | Descripción |
|---|---|---|---|
| POST | `/api/roles` | `{ "nombre": "ADMIN" }` | Crear rol |
| GET | `/api/roles` | — | Listar roles |

### Usuarios — `/api/usuarios`

| Método | URL | Body | Descripción |
|---|---|---|---|
| POST | `/api/usuarios` | `{ "username", "password" }` | Crear usuario |
| GET | `/api/usuarios` | — | Listar usuarios |
| GET | `/api/usuarios/{id}` | — | Ver usuario |
| PUT | `/api/usuarios/{id}` | `{ "username", "password" }` | Editar usuario |
| DELETE | `/api/usuarios/{id}` | — | Eliminar usuario |
| POST | `/api/usuarios/{id}/roles/{roleId}` | — | Asignar rol |
| DELETE | `/api/usuarios/{id}/roles/{roleId}` | — | quitar rol |

### Estantes — `/api/estantes`

| Método | URL | Body | Descripción |
|---|---|---|---|
| POST | `/api/estantes` | `{ "nombre", "coordX", "coordY", "ordenLogico" }` | Crear estante |
| GET | `/api/estantes` | — | Listar por orden_logico |
| GET | `/api/estantes/{id}` | — | Ver estante |
| PUT | `/api/estantes/{id}` | `{ "nombre", "coordX", "coordY", "ordenLogico" }` | Editar estante |
| DELETE | `/api/estantes/{id}` | — | Eliminar estante |

### Categorías — `/api/categorias`

| Método | URL | Body | Descripción |
|---|---|---|---|
| POST | `/api/categorias` | `{ "nombre", "descripcion" }` | Crear categoría |
| GET | `/api/categorias` | — | Listar categorías |
| GET | `/api/categorias/{id}` | — | Ver categoría |
| PUT | `/api/categorias/{id}` | `{ "nombre", "descripcion" }` | Editar categoría |
| DELETE | `/api/categorias/{id}` | — | Eliminar categoría |

### Productos — `/api/productos`

| Método | URL | Body | Descripción |
|---|---|---|---|
| POST | `/api/productos` | `{ "nombre", "precio", "stock", "descripcion", "estanteId", "categoriaId" }` | Crear producto |
| GET | `/api/productos` | — | Listar productos |
| GET | `/api/productos/{id}` | — | Ver producto |
| PUT | `/api/productos/{id}` | mismo que POST | Editar producto |
| DELETE | `/api/productos/{id}` | — | Eliminar producto |

### Listas de compra — `/api/listas`

| Método | URL | Params | Descripción |
|---|---|---|---|
| POST | `/api/listas` | `{ "usuarioId" }` | Crear lista |
| GET | `/api/listas/{id}` | — | Ver lista con items |
| GET | `/api/listas/usuario/{usuarioId}` | — | Listas de un usuario |
| PATCH | `/api/listas/{id}/finalizar` | `?forzar=false` | Finalizar lista |
| POST | `/api/listas/{id}/items` | `{ "productoId", "cantidad" }` | Agregar item |
| GET | `/api/listas/{id}/items` | — | Items ordenados por ruta |
| PUT | `/api/listas/items/{itemId}` | `{ "itemId", "cantidad" }` | Editar cantidad |
| PATCH | `/api/listas/items/{itemId}/recoger` | — | Marcar como recogido |
| PATCH | `/api/listas/items/{itemId}/devolver` | — | Desmarcar como recogido |
| DELETE | `/api/listas/items/{itemId}` | — | Eliminar item |
| DELETE | `/api/listas/{Id}` | — | Eliminar lista |
| GET | `/api/listas/{id}/items` | — | Items ordenados del historial|

---

## Seguridad

Actualmente los endpoints son públicos. Para producción se recomienda agregar Spring Security + JWT:

- `ADMIN` — acceso total a gestión de productos, estantes, categorías y usuarios
- `CLIENTE` — solo puede gestionar su propia lista de compras

---

## Reglas de negocio

- Un usuario solo puede tener **una lista EN_PROCESO** a la vez
- No se puede agregar el **mismo producto dos veces** a una lista
- No se puede agregar un producto si no hay **stock suficiente**
- El stock se descuenta al **marcar el item como recogido**
- Una lista **FINALIZADA** no admite cambios
- Al finalizar con items pendientes se puede usar `?forzar=true` para eliminarlos y finalizar

---

## Códigos de error

| Código HTTP | code | Cuándo ocurre |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Campo requerido vacío o formato inválido |
| 404 | `NOT_FOUND` | Recurso no encontrado por id |
| 409 | `BUSINESS_ERROR` | Violación de regla de negocio |

Formato de error:
```json
{
    "code": "BUSINESS_ERROR",
    "message": "El usuario ya tiene una lista en proceso",
    "timestamp": "2025-04-18T20:00:00Z",
    "path": "/api/listas"
}
```
