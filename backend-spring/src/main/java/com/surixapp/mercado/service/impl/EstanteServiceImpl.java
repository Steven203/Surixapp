package com.surixapp.mercado.service.impl;


import com.surixapp.mercado.dto.CreateEstanteRequest;
import com.surixapp.mercado.dto.EstanteResponse;
import com.surixapp.mercado.entity.Estante;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.EstanteRepository;
import com.surixapp.mercado.service.EstanteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class EstanteServiceImpl implements EstanteService {

    private final EstanteRepository repository;

    public EstanteServiceImpl(EstanteRepository repository) {
        this.repository = repository;
    }

    @Override
    public EstanteResponse create(CreateEstanteRequest request) {
        Estante e = new Estante();
        e.setNombre(request.getNombre());
        e.setCoordX(request.getCoordX());
        e.setCoordY(request.getCoordY());
        e.setOrdenLogico(request.getOrdenLogico());
        return toResponse(repository.save(e));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstanteResponse> list() {
        return repository.findAllByOrderByOrdenLogicoAsc()
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EstanteResponse getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estante " + id + " not found")));
    }

    @Override
    public EstanteResponse update(Long id, com.surixapp.mercado.dto.UpdateEstanteRequest request) {
        Estante existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estante " + id + " not found"));

        existing.setNombre(request.getNombre());
        existing.setCoordX(request.getCoordX());
        existing.setCoordY(request.getCoordY());
        existing.setOrdenLogico(request.getOrdenLogico());

        return toResponse(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Estante " + id + " not found");
        repository.deleteById(id);
    }

    private EstanteResponse toResponse(Estante e) {

        EstanteResponse r = new EstanteResponse();
        r.setId(e.getId());
        r.setNombre(e.getNombre());
        r.setCoordX(e.getCoordX());
        r.setCoordY(e.getCoordY());
        r.setOrdenLogico(e.getOrdenLogico());
        return r;
    }
}