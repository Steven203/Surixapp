// dto/ItemListaResponse.java
package com.surixapp.mercado.dto;

public class ItemListaResponse {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private Double productoPrecio;
    private String estanteNombre;
    private Integer ordenLogico;
    private Integer cantidad;
    private Boolean recogido;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getProductoNombre() {
        return productoNombre;
    }

    public void setProductoNombre(String productoNombre) {
        this.productoNombre = productoNombre;
    }

    public Double getProductoPrecio() {
        return productoPrecio;
    }

    public void setProductoPrecio(Double productoPrecio) {
        this.productoPrecio = productoPrecio;
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

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Boolean getRecogido() {
        return recogido;
    }

    public void setRecogido(Boolean recogido) {
        this.recogido = recogido;
    }
}