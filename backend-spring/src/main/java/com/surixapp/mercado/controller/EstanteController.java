// controller/EstanteController.java
package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.service.EstanteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estantes")
public class EstanteController {

    private final EstanteService service;

    public EstanteController(EstanteService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstanteResponse create(@Valid @RequestBody CreateEstanteRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<EstanteResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public EstanteResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}