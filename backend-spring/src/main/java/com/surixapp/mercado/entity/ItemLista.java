package com.surixapp.mercado.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "items_lista")
public class ItemLista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ManyToOne con ListaCompra
    @ManyToOne
    @JoinColumn(name = "lista_id", nullable = false)
    private ListaCompra lista;

    // ManyToOne con Producto
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Boolean recogido = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ListaCompra getLista() { return lista; }
    public void setLista(ListaCompra lista) { this.lista = lista; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Boolean getRecogido() { return recogido; }
    public void setRecogido(Boolean recogido) { this.recogido = recogido; }
}