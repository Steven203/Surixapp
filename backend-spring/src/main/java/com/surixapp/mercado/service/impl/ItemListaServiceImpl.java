package com.surixapp.mercado.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.surixapp.mercado.dto.CreateItemListaRequest;
import com.surixapp.mercado.dto.ItemListaResponse;
import com.surixapp.mercado.entity.ItemLista;
import com.surixapp.mercado.entity.ListaCompra;
import com.surixapp.mercado.entity.Producto;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.ItemListaRepository;
import com.surixapp.mercado.repository.ListaCompraRepository;
import com.surixapp.mercado.repository.ProductoRepository;
import com.surixapp.mercado.service.ItemListaService;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ItemListaServiceImpl implements ItemListaService {

    private final ItemListaRepository itemRepository;
    private final ListaCompraRepository listaRepository;
    private final ProductoRepository productoRepository;

    public ItemListaServiceImpl(ItemListaRepository itemRepository,
                                ListaCompraRepository listaRepository,
                                ProductoRepository productoRepository) {
        this.itemRepository = itemRepository;
        this.listaRepository = listaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public ItemListaResponse addItem(Long listaId, CreateItemListaRequest request) {
        ListaCompra lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new ResourceNotFoundException("Lista not found"));

        if (lista.getEstado() == ListaCompra.Estado.FINALIZADA) {
            throw new BusinessException("No se puede agregar items a una lista finalizada");
        }

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto not found"));

        if (itemRepository.existsByListaIdAndProductoId(listaId, request.getProductoId())) {
            throw new BusinessException("El producto '" + producto.getNombre() + "' ya está en la lista");
        }

        if (request.getCantidad() > producto.getStock()) {
            throw new BusinessException("Stock insuficiente. Disponible: " + producto.getStock());
        }

        ItemLista item = new ItemLista();
        item.setLista(lista);
        item.setProducto(producto);
        item.setCantidad(request.getCantidad());
        item.setRecogido(false);

        snapshotFromProducto(item, producto);

        return toHistoricalResponse(itemRepository.save(item));
    }

    @Override
    public ItemListaResponse marcarRecogido(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA) {
            throw new BusinessException("No se puede modificar una lista finalizada");
        }

        if (item.getRecogido()) {
            throw new BusinessException("El item ya fue marcado como recogido");
        }

        if (item.getProducto() != null) {
            Producto producto = item.getProducto();
            int nuevoStock = producto.getStock() - item.getCantidad();
            if (nuevoStock < 0) {
                throw new BusinessException("Stock insuficiente: " + producto.getNombre());
            }
            producto.setStock(nuevoStock);
            productoRepository.save(producto);
        }

        item.setRecogido(true);
        return toHistoricalResponse(itemRepository.save(item));
    }

    @Override
    public ItemListaResponse desmarcarRecogido(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA) {
            throw new BusinessException("No se puede modificar una lista finalizada");
        }

        if (!item.getRecogido()) {
            throw new BusinessException("El item ya estaba sin recoger");
        }

        item.setRecogido(false);
        return toHistoricalResponse(itemRepository.save(item));
    }

    @Override
    public ItemListaResponse updateCantidad(Long itemId, Integer cantidad) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA) {
            throw new BusinessException("No se puede modificar una lista finalizada");
        }

        if (item.getRecogido()) {
            throw new BusinessException("No se puede modificar un item ya recogido");
        }

        if (cantidad == null || cantidad <= 0) {
            throw new BusinessException("La cantidad debe ser mayor a 0");
        }

        if (item.getProducto() != null && cantidad > item.getProducto().getStock()) {
            throw new BusinessException("Stock insuficiente. Disponible: " + item.getProducto().getStock());
        }

        item.setCantidad(cantidad);
        return toHistoricalResponse(itemRepository.save(item));
    }

    @Override
    public void removeItem(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item " + itemId + " not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA) {
            throw new BusinessException("No se puede eliminar items de una lista finalizada");
        }

        itemRepository.deleteById(itemId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemListaResponse> listActiveView(Long listaId) {
        return itemRepository.findByListaId(listaId)
                .stream()
                .sorted(this::compareBySnapshotOrLiveOrder)
                .map(this::toActiveResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemListaResponse> listHistoryView(Long listaId) {
        return itemRepository.findByListaId(listaId)
                .stream()
                .sorted(this::compareBySnapshotOrLiveOrder)
                .map(this::toHistoricalResponse)
                .toList();
    }

    private void snapshotFromProducto(ItemLista item, Producto producto) {
        item.setSnapshotNombre(producto.getNombre());
        item.setSnapshotPrecio(producto.getPrecio());
        item.setSnapshotDescripcion(producto.getDescripcion());

        if (producto.getEstante() != null) {
            item.setSnapshotEstanteNombre(producto.getEstante().getNombre());
            item.setSnapshotEstanteOrden(producto.getEstante().getOrdenLogico());
        }

        if (producto.getCategoria() != null) {
            item.setSnapshotCategoriaNombre(producto.getCategoria().getNombre());
        }
    }

    private ItemListaResponse toActiveResponse(ItemLista item) {
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
            r.setProductoNombre(item.getSnapshotNombre() != null ? item.getSnapshotNombre() : "Producto eliminado");
            r.setProductoPrecio(item.getSnapshotPrecio() != null ? item.getSnapshotPrecio() : 0.0);
            r.setEstanteNombre(item.getSnapshotEstanteNombre());
            r.setOrdenLogico(item.getSnapshotEstanteOrden());
        }

        return r;
    }

    private ItemListaResponse toHistoricalResponse(ItemLista item) {
        ItemListaResponse r = new ItemListaResponse();
        r.setId(item.getId());
        r.setCantidad(item.getCantidad());
        r.setRecogido(item.getRecogido());

        r.setProductoId(item.getProducto() != null ? item.getProducto().getId() : null);
        r.setProductoNombre(item.getSnapshotNombre() != null
                ? item.getSnapshotNombre()
                : item.getProducto() != null ? item.getProducto().getNombre() : "Producto eliminado");

        r.setProductoPrecio(item.getSnapshotPrecio() != null
                ? item.getSnapshotPrecio()
                : item.getProducto() != null ? item.getProducto().getPrecio() : 0.0);

        r.setEstanteNombre(item.getSnapshotEstanteNombre());
        r.setOrdenLogico(item.getSnapshotEstanteOrden());

        return r;
    }

    private int compareBySnapshotOrLiveOrder(ItemLista a, ItemLista b) {
        Integer oa = a.getSnapshotEstanteOrden();
        if (oa == null && a.getProducto() != null && a.getProducto().getEstante() != null) {
            oa = a.getProducto().getEstante().getOrdenLogico();
        }
        if (oa == null) {
            oa = Integer.MAX_VALUE;
        }

        Integer ob = b.getSnapshotEstanteOrden();
        if (ob == null && b.getProducto() != null && b.getProducto().getEstante() != null) {
            ob = b.getProducto().getEstante().getOrdenLogico();
        }
        if (ob == null) {
            ob = Integer.MAX_VALUE;
        }

        return Integer.compare(oa, ob);
    }
}