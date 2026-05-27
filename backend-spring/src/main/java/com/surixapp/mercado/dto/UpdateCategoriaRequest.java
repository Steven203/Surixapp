package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateCategoriaRequest {

    @NotBlank(message = "nombre is required")
    private String nombre;

    private String descripcion;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}

