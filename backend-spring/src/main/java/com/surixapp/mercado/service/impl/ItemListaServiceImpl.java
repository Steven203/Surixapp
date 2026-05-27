package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.*;
import com.surixapp.mercado.service.ItemListaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

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

        // validar lista no finalizada
        if (lista.getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede agregar items a una lista finalizada");

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto not found"));

        // validar stock suficiente
        if (request.getCantidad() > producto.getStock())
            throw new BusinessException("Stock insuficiente. Disponible: " + producto.getStock());

        ItemLista item = new ItemLista();
        item.setLista(lista);
        item.setProducto(producto);
        item.setCantidad(request.getCantidad());
        item.setRecogido(false);
        return toResponse(itemRepository.save(item));
    }

    @Override
    public ItemListaResponse marcarRecogido(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item " + itemId + " not found"));

        // validar lista no finalizada
        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede modificar una lista finalizada");

        // validar que no esté ya recogido
        if (item.getRecogido())
            throw new BusinessException("El item ya fue marcado como recogido");

        // descontar stock
        Producto producto = item.getProducto();
        int nuevoStock = producto.getStock() - item.getCantidad();
        if (nuevoStock < 0)
            throw new BusinessException("Stock insuficiente para descontar: " + producto.getNombre());
        producto.setStock(nuevoStock);
        productoRepository.save(producto);

        item.setRecogido(true);
        return toResponse(itemRepository.save(item));
    }

    @Override
    public ItemListaResponse updateCantidad(Long itemId, Integer cantidad) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede modificar una lista finalizada");

        if (item.getRecogido())
            throw new BusinessException("No se puede modificar un item ya recogido");

        if (cantidad > item.getProducto().getStock())
            throw new BusinessException("Stock insuficiente. Disponible: " + item.getProducto().getStock());

        item.setCantidad(cantidad); 
        return toResponse(itemRepository.save(item));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemListaResponse> listByLista(Long listaId) {
        return itemRepository.findByListaId(listaId)
                .stream()
                .sorted((a, b) -> {
                    Integer oa = a.getProducto().getEstante() != null
                            ? a.getProducto().getEstante().getOrdenLogico()
                            : Integer.MAX_VALUE;
                    Integer ob = b.getProducto().getEstante() != null
                            ? b.getProducto().getEstante().getOrdenLogico()
                            : Integer.MAX_VALUE;
                    return Integer.compare(oa, ob);
                })
                .map(this::toResponse).toList();
    }

    @Override
    public void removeItem(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item " + itemId + " not found"));

        // validar lista no finalizada
        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede eliminar items de una lista finalizada");

        itemRepository.deleteById(itemId);
    }

    private ItemListaResponse toResponse(ItemLista item) {
        ItemListaResponse r = new ItemListaResponse();
        r.setId(item.getId());
        r.setProductoId(item.getProducto().getId());
        r.setProductoNombre(item.getProducto().getNombre());
        r.setProductoPrecio(item.getProducto().getPrecio());
        r.setCantidad(item.getCantidad());
        r.setRecogido(item.getRecogido());
        if (item.getProducto().getEstante() != null) {
            r.setEstanteNombre(item.getProducto().getEstante().getNombre());
            r.setOrdenLogico(item.getProducto().getEstante().getOrdenLogico());
        }
        return r;
    }
}