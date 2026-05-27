package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateRoleRequest {
    @NotBlank(message = "nombre is required")
    private String nombre;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}