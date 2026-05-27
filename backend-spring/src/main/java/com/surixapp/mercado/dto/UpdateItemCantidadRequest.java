// dto/UpdateItemCantidadRequest.java
package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class UpdateItemCantidadRequest {
    @NotNull(message = "cantidad is required")
    @Positive(message = "cantidad must be greater than 0")
    private Integer cantidad;

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}