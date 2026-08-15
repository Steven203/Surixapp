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

    @Autowired
    private ItemListaService itemService;
    @Autowired
    private ListaCompraService listaService;
    @Autowired
    private ProductoService productoService;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private EstanteRepository estanteRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

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
    @DisplayName("Marcar recogido — debe marcar como recogido sin modificar stock")
    void marcarRecogido_shouldMarkAsRecogidoWithoutChangingStock() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(5));
        int stockAntes = productoService.getById(producto.getId()).getStock();

        ItemListaResponse recogido = itemService.marcarRecogido(item.getId());

        assertTrue(recogido.getRecogido());
        // el stock NO debe cambiar al marcar recogido
        int stockDespues = productoService.getById(producto.getId()).getStock();
        assertEquals(stockAntes, stockDespues);
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
    @DisplayName("Actualizar cantidad — bajar de 2 a 1 no debe dar error de stock")
    void updateCantidad_shouldAllowDecreaseWithoutStockError() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(2));

        // bajar cantidad no debe lanzar error
        assertDoesNotThrow(() -> itemService.updateCantidad(item.getId(), 1));
    }

    @Test
    @DisplayName("Eliminar item — debe removerlo de la lista")
    void removeItem_shouldRemoveFromList() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(1));

        itemService.removeItem(item.getId());

        assertTrue(itemService.listActiveView(lista.getId()).isEmpty());
    }

    @Test
    @DisplayName("Actualizar cantidad — subir más allá del stock debe fallar")
    void updateCantidad_shouldFailWhenExceedingStock() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(1));

        // producto tiene 100 de stock, pedir 9999 debe fallar
        assertThrows(BusinessException.class,
                () -> itemService.updateCantidad(item.getId(), 9999));
    }

    @Test
    @DisplayName("Finalizar lista — debe descontar stock de productos recogidos")
    void finalizar_shouldDecrementStockOnFinalize() {
        ItemListaResponse item = itemService.addItem(lista.getId(), buildItemRequest(5));
        itemService.marcarRecogido(item.getId());
        int stockAntes = productoService.getById(producto.getId()).getStock();

        listaService.finalizar(lista.getId(), false);

        int stockDespues = productoService.getById(producto.getId()).getStock();
        assertEquals(stockAntes - 5, stockDespues);
    }
}
