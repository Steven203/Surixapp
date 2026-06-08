package com.surixapp.mercado.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    @JoinColumn(name = "producto_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Boolean recogido = false;

    // snapshot — se guardan al finalizar la lista
    @Column(name = "snapshot_nombre")
    private String snapshotNombre;

    @Column(name = "snapshot_precio")
    private Double snapshotPrecio;

    @Column(name = "snapshot_estante_nombre")
    private String snapshotEstanteNombre;

    @Column(name = "snapshot_estante_orden")
    private Integer snapshotEstanteOrden;

    @Column(name = "snapshot_categoria_nombre")
    private String snapshotCategoriaNombre;

    @Column(name = "snapshot_descripcion")
    private String snapshotDescripcion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ListaCompra getLista() {
        return lista;
    }

    public void setLista(ListaCompra lista) {
        this.lista = lista;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
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

    public String getSnapshotNombre() {
        return snapshotNombre;
    }

    public void setSnapshotNombre(String snapshotNombre) {
        this.snapshotNombre = snapshotNombre;
    }

    public Double getSnapshotPrecio() {
        return snapshotPrecio;
    }

    public void setSnapshotPrecio(Double snapshotPrecio) {
        this.snapshotPrecio = snapshotPrecio;
    }

    public String getSnapshotEstanteNombre() {
        return snapshotEstanteNombre;
    }

    public void setSnapshotEstanteNombre(String snapshotEstanteNombre) {
        this.snapshotEstanteNombre = snapshotEstanteNombre;
    }

    public Integer getSnapshotEstanteOrden() {
        return snapshotEstanteOrden;
    }

    public void setSnapshotEstanteOrden(Integer snapshotEstanteOrden) {
        this.snapshotEstanteOrden = snapshotEstanteOrden;
    }

    public String getSnapshotCategoriaNombre() {
        return snapshotCategoriaNombre;
    }

    public void setSnapshotCategoriaNombre(String snapshotCategoriaNombre) {
        this.snapshotCategoriaNombre = snapshotCategoriaNombre;
    }

    public String getSnapshotDescripcion() {
        return snapshotDescripcion;
    }

    public void setSnapshotDescripcion(String snapshotDescripcion) {
        this.snapshotDescripcion = snapshotDescripcion;
    }
}