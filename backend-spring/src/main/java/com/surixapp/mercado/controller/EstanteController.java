// controller/EstanteController.java
package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.request.CreateEstanteRequest;
import com.surixapp.mercado.dto.response.EstanteResponse;
import com.surixapp.mercado.service.EstanteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Estantes", description = "Gestión de estantes del supermercado")
@RestController
@RequestMapping("/api/estantes")
public class EstanteController {

    private final EstanteService service;

    public EstanteController(EstanteService service) {
        this.service = service;
    }

    @Operation(summary = "Crear estante", description = "Requiere rol ADMIN")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstanteResponse create(@Valid @RequestBody CreateEstanteRequest request) {
        return service.create(request);
    }

    @Operation(summary = "Listar estantes ordenados por orden lógico")
    @GetMapping
    public List<EstanteResponse> list() {
        return service.list();
    }

    @Operation(summary = "Obtener estante por ID")
    @GetMapping("/{id}")
    public EstanteResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @Operation(summary = "Actualizar estante", description = "Requiere rol ADMIN")
    @PutMapping("/{id}")
    public EstanteResponse update(@PathVariable Long id,
            @Valid @RequestBody CreateEstanteRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Eliminar estante", description = "Requiere rol ADMIN. No permite eliminar si hay productos con ese estante en listas activas")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
