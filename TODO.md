# TODO - PUT/DELETE ADMIN (Estante, Producto, Categoria, Usuario)

## Paso 1
- Confirmar/crear DTOs:
  - backend-spring/src/main/java/com/surixapp/mercado/dto/UpdateEstanteRequest.java
  - backend-spring/src/main/java/com/surixapp/mercado/dto/UpdateProductoRequest.java (estanteId y categoriaId obligatorios)
  - backend-spring/src/main/java/com/surixapp/mercado/dto/UpdateCategoriaRequest.java
  - backend-spring/src/main/java/com/surixapp/mercado/dto/UpdateUsuarioRequest.java

## Paso 2
- Actualizar interfaces de service con método update/delete:
  - EstanteService: update
  - ProductoService: update
  - CategoriaService: update
  - UsuarioService: update + delete

## Paso 3
- Implementar lógica en *ServiceImpl*:
  - Validar existencia (ResourceNotFoundException)
  - Resolver relaciones (Producto -> Estante/Categoria) por IDs
  - Persistir y retornar *Response*

## Paso 4
- Actualizar controllers con endpoints:
  - PUT /api/estantes/{id}
  - PUT /api/productos/{id}
  - PUT /api/categorias/{id}
  - PUT /api/usuarios/{id}
  - DELETE /api/usuarios/{id}
  ✅ Hecho

## Paso 5
- Compilar y verificar:
  - mvn -q test (o mvn -q package)
  - revisar errores de tipos/imports


