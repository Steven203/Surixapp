// dto/ProductoResponse.java
package com.surixapp.mercado.dto;

public class ProductoResponse {
    private Long id;
    private String nombre;
    private Double precio;
    private Long estanteId;
    private String estanteNombre;
    private Integer ordenLogico;

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
}