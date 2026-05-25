// dto/CreateEstanteRequest.java
package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateEstanteRequest {
    @NotBlank(message = "nombre is required")
    private String nombre;
    private Double coordX;
    private Double coordY;
    private Integer ordenLogico;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getCoordX() {
        return coordX;
    }

    public void setCoordX(Double coordX) {
        this.coordX = coordX;
    }

    public Double getCoordY() {
        return coordY;
    }

    public void setCoordY(Double coordY) {
        this.coordY = coordY;
    }

    public Integer getOrdenLogico() {
        return ordenLogico;
    }

    public void setOrdenLogico(Integer ordenLogico) {
        this.ordenLogico = ordenLogico;
    }
}