package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.entity.*;
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
    public ListaCompraResponse finalizar(Long id) {
        ListaCompra lista = listaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lista " + id + " not found"));
        lista.setEstado(ListaCompra.Estado.FINALIZADA);
        return toResponse(listaRepository.save(lista));
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