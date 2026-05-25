// service/ProductoService.java
package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.*;
import java.util.List;

public interface ProductoService {
    ProductoResponse create(CreateProductoRequest request);

    List<ProductoResponse> list();

    ProductoResponse getById(Long id);

    void delete(Long id);
}