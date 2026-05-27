package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.*;
import java.util.List;

public interface EstanteService {
    EstanteResponse create(CreateEstanteRequest request);

    List<EstanteResponse> list();

    EstanteResponse getById(Long id);

    EstanteResponse update(Long id, UpdateEstanteRequest request);

    void delete(Long id);
}

