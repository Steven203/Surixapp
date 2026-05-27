package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.*;
import com.surixapp.mercado.service.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final EstanteRepository estanteRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository,
            EstanteRepository estanteRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.estanteRepository = estanteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public ProductoResponse create(CreateProductoRequest request) {
        Producto p = new Producto();
        p.setNombre(request.getNombre());
        p.setPrecio(request.getPrecio());
        p.setDescripcion(request.getDescripcion());
        p.setStock(request.getStock() != null ? request.getStock() : 0);

        if (request.getEstanteId() != null) {
            Estante estante = estanteRepository.findById(request.getEstanteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Estante not found"));
            p.setEstante(estante);
        }

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria not found"));
            p.setCategoria(categoria);
        }

        return toResponse(productoRepository.save(p));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> list() {
        return productoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse getById(Long id) {
        return toResponse(productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto " + id + " not found")));
    }

    @Override
    public void delete(Long id) {
        if (!productoRepository.existsById(id))
            throw new ResourceNotFoundException("Producto " + id + " not found");
        productoRepository.deleteById(id);
    }

    private ProductoResponse toResponse(Producto p) {
        ProductoResponse r = new ProductoResponse();
        r.setId(p.getId());
        r.setNombre(p.getNombre());
        r.setPrecio(p.getPrecio());
        r.setDescripcion(p.getDescripcion());
        r.setStock(p.getStock());
        if (p.getEstante() != null) {
            r.setEstanteId(p.getEstante().getId());
            r.setEstanteNombre(p.getEstante().getNombre());
            r.setOrdenLogico(p.getEstante().getOrdenLogico());
        }
        if (p.getCategoria() != null) {
            r.setCategoriaId(p.getCategoria().getId());
            r.setCategoriaNombre(p.getCategoria().getNombre());
        }
        return r;
    }
}