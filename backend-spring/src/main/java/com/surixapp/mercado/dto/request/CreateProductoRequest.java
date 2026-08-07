package com.surixapp.mercado.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;

public class CreateProductoRequest {

    @NotBlank(message = "nombre is required")
    @Schema(description = "Nombre del producto", example = "Producto 1")
    private String nombre;

    @NotNull(message = "precio is required")
    @Min(value = 0, message = "precio cannot be negative")
    @Schema(description = "Precio del producto", example = "19.99")
    private Double precio;

    @Schema(description = "Descripción del producto", example = "Descripción del producto 1")
    private String descripcion;

    @NotNull(message = "stock is required")
    @Min(value = 0, message = "stock cannot be negative")
    @Schema(description = "Stock del producto", example = "10")
    private Integer stock;

    @NotNull(message = "estanteId is required")
    @Schema(description = "ID del estante", example = "1")
    private Long estanteId;

    @NotNull(message = "categoriaId is required")
    @Schema(description = "ID de la categoría", example = "1")
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