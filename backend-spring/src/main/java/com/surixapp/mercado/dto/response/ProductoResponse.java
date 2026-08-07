package com.surixapp.mercado.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class ProductoResponse {
    @Schema(description = "ID del producto", example = "1")
    private Long id;
    @Schema(description = "Nombre del producto", example = "Producto 1")
    private String nombre;
    @Schema(description = "Precio del producto", example = "19.99")
    private Double precio;
    @Schema(description = "Descripción del producto", example = "Descripción")
    private String descripcion;
    @Schema(description = "Stock del producto", example = "10")
    private Integer stock;
    @Schema(description = "ID del estante", example = "1")
    private Long estanteId;
    @Schema(description = "Nombre del estante", example = "Estante 1")
    private String estanteNombre;
    @Schema(description = "Orden lógico del producto", example = "1")
    private Integer ordenLogico;
    @Schema(description = "ID de la categoría", example = "1")
    private Long categoriaId;
    @Schema(description = "Nombre de la categoría", example = "Categoría 1")
    private String categoriaNombre;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Long getEstanteId() {
        return estanteId;
    }

    public void setEstanteId(Long estanteId) {
        this.estanteId = estanteId;
    }

    public String getEstanteNombre() {
        return estanteNombre;
    }

    public void setEstanteNombre(String estanteNombre) {
        this.estanteNombre = estanteNombre;
    }

    public Integer getOrdenLogico() {
        return ordenLogico;
    }

    public void setOrdenLogico(Integer ordenLogico) {
        this.ordenLogico = ordenLogico;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }
}