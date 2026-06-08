package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.CreateItemListaRequest;
import com.surixapp.mercado.dto.ItemListaResponse;

import java.util.List;

public interface ItemListaService {
    ItemListaResponse addItem(Long listaId, CreateItemListaRequest request);

    ItemListaResponse marcarRecogido(Long itemId);

    ItemListaResponse desmarcarRecogido(Long itemId);

    ItemListaResponse updateCantidad(Long itemId, Integer cantidad);

    void removeItem(Long itemId);

    List<ItemListaResponse> listActiveView(Long listaId);

    List<ItemListaResponse> listHistoryView(Long listaId);
}