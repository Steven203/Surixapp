package com.surixapp.mercado.dto;

public class ProductoResponse {
    private Long id;
    private String nombre;
    private Double precio;
    private String descripcion;
    private Integer stock;
    private Long estanteId;
    private String estanteNombre;
    private Integer ordenLogico;
    private Long categoriaId;
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