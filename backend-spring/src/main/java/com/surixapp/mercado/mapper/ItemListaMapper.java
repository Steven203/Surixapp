package com.surixapp.mercado.mapper;

import com.surixapp.mercado.dto.response.ItemListaResponse;
import com.surixapp.mercado.entity.ItemLista;
import org.springframework.stereotype.Component;

@Component
public class ItemListaMapper {

  public ItemListaResponse toActiveResponse(ItemLista item) {
    ItemListaResponse r = new ItemListaResponse();
    r.setId(item.getId());
    r.setCantidad(item.getCantidad());
    r.setRecogido(item.getRecogido());

    if (item.getProducto() != null) {
      r.setProductoId(item.getProducto().getId());
      r.setProductoNombre(item.getProducto().getNombre());
      r.setProductoPrecio(item.getProducto().getPrecio());
      if (item.getProducto().getEstante() != null) {
        r.setEstanteNombre(item.getProducto().getEstante().getNombre());
        r.setOrdenLogico(item.getProducto().getEstante().getOrdenLogico());
      } else {
        r.setEstanteNombre(item.getSnapshotEstanteNombre());
        r.setOrdenLogico(item.getSnapshotEstanteOrden());
      }
    } else {
      r.setProductoId(null);
      r.setProductoNombre(item.getSnapshotNombre() != null
          ? item.getSnapshotNombre()
          : "Producto eliminado");
      r.setProductoPrecio(item.getSnapshotPrecio() != null
          ? item.getSnapshotPrecio()
          : 0.0);
      r.setEstanteNombre(item.getSnapshotEstanteNombre());
      r.setOrdenLogico(item.getSnapshotEstanteOrden());
    }

    return r;
  }

  public ItemListaResponse toHistoricalResponse(ItemLista item) {
    ItemListaResponse r = new ItemListaResponse();
    r.setId(item.getId());
    r.setCantidad(item.getCantidad());
    r.setRecogido(item.getRecogido());

    boolean tieneSnapshot = item.getSnapshotNombre() != null;
    boolean tieneProducto = item.getProducto() != null;

    if (tieneSnapshot) {
      r.setProductoId(tieneProducto ? item.getProducto().getId() : null);
      r.setProductoNombre(item.getSnapshotNombre());
      r.setProductoPrecio(item.getSnapshotPrecio());
      r.setEstanteNombre(item.getSnapshotEstanteNombre());
      r.setOrdenLogico(item.getSnapshotEstanteOrden());
    } else if (tieneProducto) {
      r.setProductoId(item.getProducto().getId());
      r.setProductoNombre(item.getProducto().getNombre());
      r.setProductoPrecio(item.getProducto().getPrecio());
      if (item.getProducto().getEstante() != null) {
        r.setEstanteNombre(item.getProducto().getEstante().getNombre());
        r.setOrdenLogico(item.getProducto().getEstante().getOrdenLogico());
      }
    } else {
      r.setProductoNombre("Producto eliminado");
      r.setProductoPrecio(0.0);
    }

    return r;
  }
}