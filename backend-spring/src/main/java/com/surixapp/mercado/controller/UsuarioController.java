// controller/UsuarioController.java
package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse create(@Valid @RequestBody CreateUsuarioRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<UsuarioResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public UsuarioResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping("/{usuarioId}/roles/{roleId}")
    public UsuarioResponse assignRole(@PathVariable Long usuarioId,
            @PathVariable Long roleId) {
        return service.assignRole(usuarioId, roleId);
    }
}