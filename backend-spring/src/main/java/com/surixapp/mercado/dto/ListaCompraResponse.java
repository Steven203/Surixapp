// dto/ListaCompraResponse.java
package com.surixapp.mercado.dto;

import java.util.List;

public class ListaCompraResponse {
    private Long id;
    private Long usuarioId;
    private String estado;
    private List<ItemListaResponse> items;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<ItemListaResponse> getItems() {
        return items;
    }

    public void setItems(List<ItemListaResponse> items) {
        this.items = items;
    }
}