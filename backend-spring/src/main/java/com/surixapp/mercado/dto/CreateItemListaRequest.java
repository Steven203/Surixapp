// dto/CreateItemListaRequest.java
package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotNull;

public class CreateItemListaRequest {
    @NotNull(message = "productoId is required")
    private Long productoId;
    @NotNull(message = "cantidad is required")
    private Integer cantidad;

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}