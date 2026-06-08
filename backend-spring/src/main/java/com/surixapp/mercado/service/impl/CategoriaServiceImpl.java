package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.entity.Categoria;
import com.surixapp.mercado.entity.ListaCompra;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.CategoriaRepository;
import com.surixapp.mercado.repository.ItemListaRepository;
import com.surixapp.mercado.service.CategoriaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository repository;
    private final ItemListaRepository itemListaRepository;

    public CategoriaServiceImpl(CategoriaRepository repository, ItemListaRepository itemListaRepository) {
        this.repository = repository;
        this.itemListaRepository = itemListaRepository;
    }

    @Override
    public CategoriaResponse create(CreateCategoriaRequest request) {
        Categoria c = new Categoria();
        c.setNombre(request.getNombre());
        c.setDescripcion(request.getDescripcion());
        return toResponse(repository.save(c));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> list() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaResponse getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria " + id + " not found")));
    }

    @Override
    public CategoriaResponse update(Long id, com.surixapp.mercado.dto.CreateCategoriaRequest request) {
        Categoria existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria " + id + " not found"));

        existing.setNombre(request.getNombre());
        existing.setDescripcion(request.getDescripcion());

        return toResponse(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Categoria " + id + " not found");

        boolean tieneProductosEnListaActiva = itemListaRepository
                .existsByProductoCategoriaIdAndListaEstado(id, ListaCompra.Estado.EN_PROCESO);

        if (tieneProductosEnListaActiva)
            throw new BusinessException(
                    "No puedes eliminar esta categoría porque tiene productos en listas activas");

        repository.deleteById(id);
    }

    private CategoriaResponse toResponse(Categoria c) {

        CategoriaResponse r = new CategoriaResponse();
        r.setId(c.getId());
        r.setNombre(c.getNombre());
        r.setDescripcion(c.getDescripcion());
        return r;
    }
}