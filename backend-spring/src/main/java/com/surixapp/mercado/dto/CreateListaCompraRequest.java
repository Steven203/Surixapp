// dto/CreateListaCompraRequest.java
package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotNull;

public class CreateListaCompraRequest {
    @NotNull(message = "usuarioId is required")
    private Long usuarioId;

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}