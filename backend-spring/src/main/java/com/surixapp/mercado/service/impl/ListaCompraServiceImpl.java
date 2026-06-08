package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.exception.ResourceNotFoundException;
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

    public ListaCompraServiceImpl(ListaCompraRepository listaRepository,
            UsuarioRepository usuarioRepository) {
        this.listaRepository = listaRepository;
        this.usuarioRepository = usuarioRepository;
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
                .orElseThrow(() -> new ResourceNotFoundException("Lista " + id + " not found"));

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

        // guardar snapshot de cada item antes de finalizar
        for (ItemLista item : lista.getItems()) {
            if (item.getProducto() != null) {
                Producto p = item.getProducto();
                item.setSnapshotNombre(p.getNombre());
                item.setSnapshotPrecio(p.getPrecio());
                item.setSnapshotDescripcion(p.getDescripcion());
                if (p.getEstante() != null) {
                    item.setSnapshotEstanteNombre(p.getEstante().getNombre());
                    item.setSnapshotEstanteOrden(p.getEstante().getOrdenLogico());
                }
                if (p.getCategoria() != null) {
                    item.setSnapshotCategoriaNombre(p.getCategoria().getNombre());
                }
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
        r.setItems(lista.getItems().stream().map(this::itemToResponse).toList());
        return r;
    }

    private ItemListaResponse itemToResponse(ItemLista item) {
        ItemListaResponse r = new ItemListaResponse();
        r.setId(item.getId());
        r.setCantidad(item.getCantidad());
        r.setRecogido(item.getRecogido());

        // usar snapshot si el producto fue borrado
        boolean tieneProducto = item.getProducto() != null;
        boolean tieneSnapshot = item.getSnapshotNombre() != null;

        if (tieneProducto) {
            // lista en proceso — datos en vivo del producto
            r.setProductoId(item.getProducto().getId());
            r.setProductoNombre(item.getProducto().getNombre());
            r.setProductoPrecio(item.getProducto().getPrecio());
            if (item.getProducto().getEstante() != null) {
                r.setEstanteNombre(item.getProducto().getEstante().getNombre());
                r.setOrdenLogico(item.getProducto().getEstante().getOrdenLogico());
            }
        } else if (tieneSnapshot) {
            // lista finalizada — datos del snapshot
            r.setProductoId(null);
            r.setProductoNombre(item.getSnapshotNombre());
            r.setProductoPrecio(item.getSnapshotPrecio());
            r.setEstanteNombre(item.getSnapshotEstanteNombre());
            r.setOrdenLogico(item.getSnapshotEstanteOrden());
        }

        return r;
    }
}