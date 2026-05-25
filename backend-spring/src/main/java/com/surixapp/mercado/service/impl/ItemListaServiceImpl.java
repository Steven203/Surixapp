package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.entity.*;
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
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto not found"));
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
        item.setRecogido(true);
        return toResponse(itemRepository.save(item));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemListaResponse> listByLista(Long listaId) {
        return itemRepository.findByListaId(listaId)
                .stream()
                .sorted((a, b) -> {
                    // ordena por orden_logico del estante — la ruta sugerida
                    Integer oa = a.getProducto().getEstante() != null
                            ? a.getProducto().getEstante().getOrdenLogico() : Integer.MAX_VALUE;
                    Integer ob = b.getProducto().getEstante() != null
                            ? b.getProducto().getEstante().getOrdenLogico() : Integer.MAX_VALUE;
                    return Integer.compare(oa, ob);
                })
                .map(this::toResponse).toList();
    }

    @Override
    public void removeItem(Long itemId) {
        if (!itemRepository.existsById(itemId))
            throw new ResourceNotFoundException("Item " + itemId + " not found");
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