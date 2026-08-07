// controller/ProductoController.java
package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.request.CreateProductoRequest;
import com.surixapp.mercado.dto.response.ProductoResponse;
import com.surixapp.mercado.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Productos", description = "Gestión de productos del supermercado")
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @Operation(summary = "Crear producto", description = "Requiere rol ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Producto creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Sin permisos"),
            @ApiResponse(responseCode = "409", description = "Nombre ya existe"),
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponse create(@Valid @RequestBody CreateProductoRequest request) {
        return service.create(request);
    }

    @Operation(summary = "Listar productos", description = "Público — no requiere autenticación")
    @GetMapping
    public List<ProductoResponse> list() {
        return service.list();
    }

    @Operation(summary = "Obtener producto por ID")
    @GetMapping("/{id}")
    public ProductoResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @Operation(summary = "Actualizar producto", description = "Requiere rol ADMIN")
    @PutMapping("/{id}")
    public ProductoResponse update(@PathVariable Long id,
            @Valid @RequestBody CreateProductoRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Eliminar producto", description = "Requiere rol ADMIN. No permite eliminar si hay clientes con el producto en lista activa")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminado"),
            @ApiResponse(responseCode = "409", description = "Producto en lista activa"),
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
