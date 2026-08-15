package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.request.CreateListaCompraRequest;
import com.surixapp.mercado.dto.response.ListaCompraResponse;
import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.mapper.ItemListaMapper;
import com.surixapp.mercado.repository.*;
import com.surixapp.mercado.service.ListaCompraService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ListaCompraServiceImpl implements ListaCompraService {

    private final ListaCompraRepository listaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final ItemListaMapper mapper; // ← inyectar mapper

    public ListaCompraServiceImpl(ListaCompraRepository listaRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository,
            ItemListaMapper mapper) {
        this.listaRepository = listaRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.mapper = mapper;
    }

    @Override
    public ListaCompraResponse create(CreateListaCompraRequest request) {
        Usuario u = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario not found"));

        // validar que no tenga lista activa
        boolean tieneListaActiva = listaRepository.existsByUsuarioIdAndEstado(
                request.getUsuarioId(), ListaCompra.Estado.EN_PROCESO);
        if (tieneListaActiva)
            throw new BusinessException("El usuario ya tiene una lista en proceso");

        ListaCompra lista = new ListaCompra();
        lista.setUsuario(u);
        lista.setEstado(ListaCompra.Estado.EN_PROCESO);
        return toResponse(listaRepository.save(lista));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListaCompraResponse> listByUsuario(Long usuarioId) {
        return listaRepository.findByUsuarioId(usuarioId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ListaCompraResponse getById(Long id) {
        return toResponse(listaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lista " + id + " not found")));
    }

    @Override
    public ListaCompraResponse finalizar(Long id, boolean forzar) {
        ListaCompra lista = listaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lista not found"));

        if (lista.getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("La lista ya está finalizada");

        List<ItemLista> pendientes = lista.getItems().stream()
                .filter(item -> !item.getRecogido()).toList();

        if (!pendientes.isEmpty() && !forzar) {
            String nombres = pendientes.stream()
                    .map(i -> i.getProducto() != null
                            ? i.getProducto().getNombre()
                            : i.getSnapshotNombre())
                    .collect(java.util.stream.Collectors.joining(", "));
            throw new BusinessException("Tienes items sin recoger: " + nombres);
        }

        if (!pendientes.isEmpty()) {
            lista.getItems().removeIf(item -> !item.getRecogido());
        }

        // validar stock y descontar solo al finalizar
        List<String> sinStock = new java.util.ArrayList<>();

        for (ItemLista item : lista.getItems()) {
            if (item.getProducto() == null)
                continue;

            Producto producto = item.getProducto();
            int stockActual = producto.getStock();

            if (item.getCantidad() > stockActual) {
                sinStock.add(
                        producto.getNombre() +
                                " (pediste " + item.getCantidad() +
                                ", disponible " + stockActual + ")");
            }
        }

        if (!sinStock.isEmpty()) {
            throw new BusinessException(
                    "Stock insuficiente para finalizar. Ajusta las cantidades de: " +
                            String.join(", ", sinStock));
        }

        // descontar stock y guardar snapshot
        for (ItemLista item : lista.getItems()) {
            if (item.getProducto() == null)
                continue;

            Producto producto = item.getProducto();

            // descontar stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            // guardar snapshot
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

        lista.setEstado(ListaCompra.Estado.FINALIZADA);
        return toResponse(listaRepository.save(lista));
    }

    @Override
    public void delete(Long id) {
        ListaCompra lista = listaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lista not found"));
        if (lista.getEstado() == ListaCompra.Estado.FINALIZADA)
            throw new BusinessException("No puedes eliminar una lista finalizada");
        listaRepository.deleteById(id); // cascade borra los items automáticamente
    }

    private ListaCompraResponse toResponse(ListaCompra lista) {
        ListaCompraResponse r = new ListaCompraResponse();
        r.setId(lista.getId());
        r.setUsuarioId(lista.getUsuario().getId());
        r.setEstado(lista.getEstado().name());

        // usa el mapper según el estado de la lista
        boolean finalizada = lista.getEstado() == ListaCompra.Estado.FINALIZADA;
        r.setItems(lista.getItems().stream()
                .map(item -> finalizada
                        ? mapper.toHistoricalResponse(item)
                        : mapper.toActiveResponse(item))
                .toList());

        return r;
    }
}