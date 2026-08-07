// dto/ItemListaResponse.java
package com.surixapp.mercado.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class ItemListaResponse {
    @Schema(description = "ID del item en la lista", example = "1")
    private Long id;
    @Schema(description = "ID del producto", example = "1")
    private Long productoId;
    @Schema(description = "Nombre del producto", example = "Producto 1")
    private String productoNombre;
    @Schema(description = "Precio del producto", example = "19.99")
    private Double productoPrecio;
    @Schema(description = "Nombre del estante", example = "Estante 1")
    private String estanteNombre;
    @Schema(description = "Orden lógico", example = "1")
    private Integer ordenLogico;
    @Schema(description = "Cantidad", example = "5")
    private Integer cantidad;
    @Schema(description = "Recogido", example = "false")
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