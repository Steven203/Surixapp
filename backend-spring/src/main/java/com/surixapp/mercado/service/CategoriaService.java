package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.*;
import java.util.List;

public interface CategoriaService {
    CategoriaResponse create(CreateCategoriaRequest request);
    List<CategoriaResponse> list();
    CategoriaResponse getById(Long id);

    CategoriaResponse update(Long id, UpdateCategoriaRequest request);

    void delete(Long id);
}

