package com.surixapp.mercado.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.surixapp.mercado.dto.request.CreateItemListaRequest;
import com.surixapp.mercado.dto.response.ItemListaResponse;
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
import com.surixapp.mercado.mapper.ItemListaMapper;

@Service
@Transactional
public class ItemListaServiceImpl implements ItemListaService {

    private final ItemListaRepository itemRepository;
    private final ListaCompraRepository listaRepository;
    private final ProductoRepository productoRepository;
    private final ItemListaMapper mapper;

    public ItemListaServiceImpl(ItemListaRepository itemRepository,
            ListaCompraRepository listaRepository,
            ProductoRepository productoRepository,
            ItemListaMapper mapper) {
        this.itemRepository = itemRepository;
        this.listaRepository = listaRepository;
        this.productoRepository = productoRepository;
        this.mapper = mapper;
    }

    @Override
    public ItemListaResponse addItem(Long listaId, CreateItemListaRequest request) {
        ListaCompra lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new ResourceNotFoundException("Lista not found"));

        if (lista.getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede agregar items a una lista finalizada");

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto not found"));

        if (itemRepository.existsByListaIdAndProductoId(listaId, request.getProductoId()))
            throw new BusinessException("El producto '" + producto.getNombre() + "' ya está en la lista");

        if (request.getCantidad() > producto.getStock())
            throw new BusinessException("Stock insuficiente. Disponible: " + producto.getStock());

        ItemLista item = new ItemLista();
        item.setLista(lista);
        item.setProducto(producto);
        item.setCantidad(request.getCantidad());
        item.setRecogido(false);
        lista.getItems().add(item);
        // snapshot NO se guarda aquí — se guarda al finalizar

        return mapper.toActiveResponse(itemRepository.save(item)); // ← activeResponse
    }

    @Override
    public ItemListaResponse marcarRecogido(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede modificar una lista finalizada");

        if (item.getRecogido())
            throw new BusinessException("El item ya fue marcado como recogido");

        item.setRecogido(true);
        return mapper.toActiveResponse(itemRepository.save(item));
    }

    @Override
    public ItemListaResponse desmarcarRecogido(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede modificar una lista finalizada");

        if (!item.getRecogido())
            throw new BusinessException("El item ya estaba sin recoger");

        item.setRecogido(false);
        return mapper.toActiveResponse(itemRepository.save(item));
    }

    @Override
    public ItemListaResponse updateCantidad(Long itemId, Integer nuevaCantidad) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede modificar una lista finalizada");

        if (item.getRecogido())
            throw new BusinessException("No se puede modificar un item ya recogido");

        if (item.getProducto() == null)
            throw new BusinessException("El producto ya no está disponible");

        int cantidadActual = item.getCantidad();
        int stockDisponible = item.getProducto().getStock();

        if (nuevaCantidad > stockDisponible) {
            throw new BusinessException(
                    "Stock insuficiente. Disponible: " + stockDisponible +
                            " (ya tienes " + cantidadActual + " en tu lista)");
        }

        item.setCantidad(nuevaCantidad);
        return mapper.toActiveResponse(itemRepository.save(item));
    }

    @Override
    public void removeItem(Long itemId) {
        ItemLista item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item " + itemId + " not found"));

        if (item.getLista().getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No se puede eliminar items de una lista finalizada");

        if (item.getLista() != null && item.getLista().getItems() != null) {
            item.getLista().getItems().remove(item);
        }
        itemRepository.deleteById(itemId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemListaResponse> listActiveView(Long listaId) {
        return itemRepository.findByListaId(listaId)
                .stream()
                .sorted(this::compareBySnapshotOrLiveOrder)
                .map(mapper::toActiveResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemListaResponse> listHistoryView(Long listaId) {
        return itemRepository.findByListaId(listaId)
                .stream()
                .sorted(this::compareBySnapshotOrLiveOrder)
                .map(mapper::toHistoricalResponse)
                .toList();
    }

    private int compareBySnapshotOrLiveOrder(ItemLista a, ItemLista b) {
        Integer oa = a.getSnapshotEstanteOrden();
        if (oa == null && a.getProducto() != null && a.getProducto().getEstante() != null)
            oa = a.getProducto().getEstante().getOrdenLogico();
        if (oa == null)
            oa = Integer.MAX_VALUE;

        Integer ob = b.getSnapshotEstanteOrden();
        if (ob == null && b.getProducto() != null && b.getProducto().getEstante() != null)
            ob = b.getProducto().getEstante().getOrdenLogico();
        if (ob == null)
            ob = Integer.MAX_VALUE;

        return Integer.compare(oa, ob);
    }
}