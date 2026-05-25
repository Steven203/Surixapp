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

    public ProductoServiceImpl(ProductoRepository productoRepository,
            EstanteRepository estanteRepository) {
        this.productoRepository = productoRepository;
        this.estanteRepository = estanteRepository;
    }

    @Override
    public ProductoResponse create(CreateProductoRequest request) {
        Producto p = new Producto();
        p.setNombre(request.getNombre());
        p.setPrecio(request.getPrecio());
        if (request.getEstanteId() != null) {
            Estante estante = estanteRepository.findById(request.getEstanteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Estante not found"));
            p.setEstante(estante);
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
        if (p.getEstante() != null) {
            r.setEstanteId(p.getEstante().getId());
            r.setEstanteNombre(p.getEstante().getNombre());
            r.setOrdenLogico(p.getEstante().getOrdenLogico());
        }
        return r;
    }
}