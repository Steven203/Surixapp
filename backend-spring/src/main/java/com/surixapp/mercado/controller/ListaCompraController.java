// controller/ListaCompraController.java
package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.service.ItemListaService;
import com.surixapp.mercado.service.ListaCompraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/listas")
public class ListaCompraController {

    private final ListaCompraService listaService;
    private final ItemListaService itemService;

    public ListaCompraController(ListaCompraService listaService,
            ItemListaService itemService) {
        this.listaService = listaService;
        this.itemService = itemService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListaCompraResponse create(@Valid @RequestBody CreateListaCompraRequest request) {
        return listaService.create(request);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<ListaCompraResponse> listByUsuario(@PathVariable Long usuarioId) {
        return listaService.listByUsuario(usuarioId);
    }

    @GetMapping("/{id}")
    public ListaCompraResponse getById(@PathVariable Long id) {
        return listaService.getById(id);
    }

    @PatchMapping("/{id}/finalizar")
    public ListaCompraResponse finalizar(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean forzar) {
        return listaService.finalizar(id, forzar);
    }

    // Items dentro de la lista
    @PostMapping("/{listaId}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemListaResponse addItem(@PathVariable Long listaId,
            @Valid @RequestBody CreateItemListaRequest request) {
        return itemService.addItem(listaId, request);
    }

    @GetMapping("/{listaId}/items")
    public List<ItemListaResponse> listItems(@PathVariable Long listaId) {
        return itemService.listByLista(listaId);
    }

    @PatchMapping("/items/{itemId}/recoger")
    public ItemListaResponse marcarRecogido(@PathVariable Long itemId) {
        return itemService.marcarRecogido(itemId);
    }

    @PatchMapping("/items/{itemId}/desrecoger")
    public ItemListaResponse desmarcarRecogido(@PathVariable Long itemId) {
        return itemService.desmarcarRecogido(itemId);
    }

    @DeleteMapping("/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable Long itemId) {
        itemService.removeItem(itemId);
    }

    @PutMapping("/items/{itemId}")
    public ItemListaResponse updateCantidad(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateItemCantidadRequest request) {
        return itemService.updateCantidad(itemId, request.getCantidad());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        listaService.delete(id);
    }
}