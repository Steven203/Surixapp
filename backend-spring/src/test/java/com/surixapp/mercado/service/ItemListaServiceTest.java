package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.request.CreateItemListaRequest;
import com.surixapp.mercado.dto.request.CreateListaCompraRequest;
import com.surixapp.mercado.dto.request.CreateProductoRequest;
import com.surixapp.mercado.dto.response.ItemListaResponse;
import com.surixapp.mercado.dto.response.ListaCompraResponse;
import com.surixapp.mercado.dto.response.ProductoResponse;
import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ItemListaServiceTest {

    @Autowired private ItemListaService itemService;
    @Autowired private ListaCompraService listaService;
    @Autowired private ProductoService productoService;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private EstanteRepository estanteRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private ListaCompraResponse lista;
    private ProductoResponse producto;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setNombre("CLIENTE");
        role = roleRepository.save(role);

        Usuario usuario = new Usuario();
        usuario.setUsername("cliente_items_test");
        usuario.setPassword(passwordEncoder.encode("1234"));
        usuario.getRoles().add(role);
        usuario = usuarioRepository.save(usuario);

        Estante estante = new Estante();
        estante.setNombre("Estante Items Test");
        estante.setCoordX(1.0);
        estante.setCoordY(1.0);
        estante.setOrdenLogico(1);
        estante = estanteRepository.save(estante);

        Categoria categoria = new Categoria();
        categoria.setNombre("Categoria Items Test");
        categoria = categoriaRepository.save(categoria);

        CreateProductoRequest prodReq = new CreateProductoRequest();
        prodReq.setNombre("Producto Test");
        prodReq.setPrecio(1000.0);
        prodReq.setStock(100);
        prodReq.setEstanteId(estante.getId());
        prodReq.setCategoriaId(categoria.getId());
        producto = productoService.create(prodReq);

        CreateListaCompraRequest listaReq = new CreateListaCompraRequest();
        listaReq.setUsuarioId(usuario.getId());
        lista = listaService.create(listaReq);
    }

    private CreateItemListaRequest buildItemRequest(int cantidad) {
        CreateItemListaRequest req = new CreateItemListaRequest();
        req.setProductoId(producto.getId());
        req.setCantidad(cantidad);
        return req;
    }

    @Test
    @DisplayName("Agregar item — debe agregarlo a la lista")
    void addItem_shouldAddItemToList() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(3));

        assertNotNull(item.getId());
        assertEquals(producto.getId(), item.getProductoId());
        assertEquals(3, item.getCantidad());
        assertFalse(item.getRecogido());
    }

    @Test
    @DisplayName("Agregar item — no debe permitir producto duplicado en la misma lista")
    void addItem_shouldThrowWhenDuplicateProduct() {
        itemService.addItem(lista.getId(), buildItemRequest(1));

        assertThrows(BusinessException.class,
                () -> itemService.addItem(lista.getId(), buildItemRequest(2)));
    }

    @Test
    @DisplayName("Agregar item — debe fallar si stock insuficiente")
    void addItem_shouldThrowWhenInsufficientStock() {
        assertThrows(BusinessException.class,
                () -> itemService.addItem(lista.getId(), buildItemRequest(9999)));
    }

    @Test
    @DisplayName("Marcar recogido — debe descontar stock y marcar como recogido")
    void marcarRecogido_shouldDecrementStockAndMarkAsRecogido() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(5));
        int stockInicial = producto.getStock();

        ItemListaResponse recogido = itemService.marcarRecogido(item.getId());

        assertTrue(recogido.getRecogido());
        ProductoResponse productoActualizado = productoService.getById(producto.getId());
        assertEquals(stockInicial - 5, productoActualizado.getStock());
    }

    @Test
    @DisplayName("Marcar recogido — no debe permitir marcar dos veces")
    void marcarRecogido_shouldThrowWhenAlreadyRecogido() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(1));
        itemService.marcarRecogido(item.getId());

        assertThrows(BusinessException.class,
                () -> itemService.marcarRecogido(item.getId()));
    }

    @Test
    @DisplayName("Actualizar cantidad — debe modificar la cantidad del item")
    void updateCantidad_shouldUpdateItemCantidad() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(2));

        ItemListaResponse updated = itemService.updateCantidad(item.getId(), 8);

        assertEquals(8, updated.getCantidad());
    }

    @Test
    @DisplayName("Eliminar item — debe removerlo de la lista")
    void removeItem_shouldRemoveFromList() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(1));

        itemService.removeItem(item.getId());

        assertTrue(itemService.listActiveView(lista.getId()).isEmpty());
    }
}
