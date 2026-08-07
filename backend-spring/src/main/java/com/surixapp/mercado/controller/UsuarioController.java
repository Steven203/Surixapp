// controller/UsuarioController.java
package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.request.CreateUsuarioRequest;
import com.surixapp.mercado.dto.request.UpdateUsuarioRequest;
import com.surixapp.mercado.dto.response.UsuarioResponse;
import com.surixapp.mercado.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Usuarios", description = "Gestión de usuarios — requiere rol ADMIN")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @Operation(summary = "Crear usuario")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse create(@Valid @RequestBody CreateUsuarioRequest request) {
        return service.create(request);
    }

    @Operation(summary = "Listar usuarios")
    @GetMapping
    public List<UsuarioResponse> list() {
        return service.list();
    }

    @Operation(summary = "Obtener usuario por ID")
    @GetMapping("/{id}")
    public UsuarioResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @Operation(summary = "Actualizar usuario")
    @PutMapping("/{id}")
    public UsuarioResponse update(@PathVariable Long id,
            @Valid @RequestBody UpdateUsuarioRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Eliminar usuario", description = "No permite eliminar si tiene lista activa")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @Operation(summary = "Asignar rol a usuario")
    @PostMapping("/{usuarioId}/roles/{roleId}")
    public UsuarioResponse assignRole(@PathVariable Long usuarioId,
            @PathVariable Long roleId) {
        return service.assignRole(usuarioId, roleId);
    }

    @Operation(summary = "Remover rol de usuario")
    @DeleteMapping("/{usuarioId}/roles/{roleId}")
    public UsuarioResponse removeRole(@PathVariable Long usuarioId,
            @PathVariable Long roleId) {
        return service.removeRole(usuarioId, roleId);
    }
}
