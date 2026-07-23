// service/ListaCompraService.java
package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.request.*;
import com.surixapp.mercado.dto.response.ListaCompraResponse;

import java.util.List;

public interface ListaCompraService {
    ListaCompraResponse create(CreateListaCompraRequest request);

    List<ListaCompraResponse> listByUsuario(Long usuarioId);

    ListaCompraResponse getById(Long id);

    ListaCompraResponse finalizar(Long id, boolean forzar);

    void delete(Long id);
}