package com.surixapp.mercado.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateProductoRequest {

    @NotBlank(message = "nombre is required")
    private String nombre;

    @NotNull(message = "precio is required")
    @Min(value = 0, message = "precio cannot be negative")
    private Double precio;

    private String descripcion;

    @NotNull(message = "stock is required")
    @Min(value = 0, message = "stock cannot be negative")
    private Integer stock;

    @NotNull(message = "estanteId is required")
    private Long estanteId;

    @NotNull(message = "categoriaId is required")
    private Long categoriaId;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Long getEstanteId() { return estanteId; }
    public void setEstanteId(Long estanteId) { this.estanteId = estanteId; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
}