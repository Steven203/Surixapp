// service/ItemListaService.java
package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.*;
import java.util.List;

public interface ItemListaService {
    ItemListaResponse addItem(Long listaId, CreateItemListaRequest request);

    ItemListaResponse marcarRecogido(Long itemId);

    List<ItemListaResponse> listByLista(Long listaId);

    void removeItem(Long itemId);
}