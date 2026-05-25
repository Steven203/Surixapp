// dto/CreateProductoRequest.java
package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateProductoRequest {
    @NotBlank(message = "nombre is required")
    private String nombre;
    @NotNull(message = "precio is required")
    private Double precio;
    private Long estanteId;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Long getEstanteId() {
        return estanteId;
    }

    public void setEstanteId(Long estanteId) {
        this.estanteId = estanteId;
    }
}