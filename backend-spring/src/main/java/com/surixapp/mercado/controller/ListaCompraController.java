package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.request.CreateItemListaRequest;
import com.surixapp.mercado.dto.request.CreateListaCompraRequest;
import com.surixapp.mercado.dto.request.UpdateItemCantidadRequest;
import com.surixapp.mercado.dto.response.ItemListaResponse;
import com.surixapp.mercado.dto.response.ListaCompraResponse;
import com.surixapp.mercado.service.ItemListaService;
import com.surixapp.mercado.service.ListaCompraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Listas de Compra", description = "Gestión de listas de compra — requiere autenticación")
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

    @Operation(summary = "Crear lista de compra")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListaCompraResponse create(@Valid @RequestBody CreateListaCompraRequest request) {
        return listaService.create(request);
    }

    @Operation(summary = "Listas de un usuario")
    @GetMapping("/usuario/{usuarioId}")
    public List<ListaCompraResponse> listByUsuario(@PathVariable Long usuarioId) {
        return listaService.listByUsuario(usuarioId);
    }

    @Operation(summary = "Obtener lista por ID")
    @GetMapping("/{id}")
    public ListaCompraResponse getById(@PathVariable Long id) {
        return listaService.getById(id);
    }

    @Operation(summary = "Finalizar lista", description = "Guarda snapshot de productos. Con `forzar=true` elimina items pendientes y finaliza")
    @PatchMapping("/{id}/finalizar")
    public ListaCompraResponse finalizar(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean forzar) {
        return listaService.finalizar(id, forzar);
    }

    @Operation(summary = "Agregar producto a lista")
    @PostMapping("/{listaId}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemListaResponse addItem(@PathVariable Long listaId,
            @Valid @RequestBody CreateItemListaRequest request) {
        return itemService.addItem(listaId, request);
    }

    @Operation(summary = "Items de la lista ordenados por ruta sugerida")
    @GetMapping("/{listaId}/items")
    public List<ItemListaResponse> listItems(@PathVariable Long listaId) {
        return itemService.listActiveView(listaId);
    }

    @GetMapping("/{listaId}/detalle")
    public List<ItemListaResponse> listItemsHistorial(@PathVariable Long listaId) {
        return itemService.listHistoryView(listaId);
    }

    @Operation(summary = "Marcar item como recogido — descuenta stock")
    @PatchMapping("/items/{itemId}/recoger")
    public ItemListaResponse marcarRecogido(@PathVariable Long itemId) {
        return itemService.marcarRecogido(itemId);
    }

    @Operation(summary = "Desmarcar item — devolver al estante")
    @PatchMapping("/items/{itemId}/desrecoger")
    public ItemListaResponse desmarcarRecogido(@PathVariable Long itemId) {
        return itemService.desmarcarRecogido(itemId);
    }

    @Operation(summary = "Eliminar item de la lista")
    @DeleteMapping("/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable Long itemId) {
        itemService.removeItem(itemId);
    }

    @Operation(summary = "Actualizar cantidad de un item")
    @PutMapping("/items/{itemId}")
    public ItemListaResponse updateCantidad(@PathVariable Long itemId,
            @Valid @RequestBody UpdateItemCantidadRequest request) {
        return itemService.updateCantidad(itemId, request.getCantidad());
    }

    @Operation(summary = "Eliminar lista vacía")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        listaService.delete(id);
    }
}