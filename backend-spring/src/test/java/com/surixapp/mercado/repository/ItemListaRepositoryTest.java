package com.surixapp.mercado.repository;

import com.surixapp.mercado.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class ItemListaRepositoryTest {

    @Autowired private ItemListaRepository itemListaRepository;
    @Autowired private ListaCompraRepository listaRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EstanteRepository estanteRepository;

    private ListaCompra lista;
    private Producto producto;

    @BeforeEach
    void setUp() {
        Usuario usuario = new Usuario();
        usuario.setUsername("test_repo");
        usuario.setPassword(new BCryptPasswordEncoder().encode("1234"));
        usuario = usuarioRepository.save(usuario);

        lista = new ListaCompra();
        lista.setUsuario(usuario);
        lista.setEstado(ListaCompra.Estado.EN_PROCESO);
        lista = listaRepository.save(lista);

        Estante estante = new Estante();
        estante.setNombre("Estante Repo Test");
        estante.setCoordX(1.0);
        estante.setCoordY(1.0);
        estante.setOrdenLogico(1);
        estante = estanteRepository.save(estante);

        producto = new Producto();
        producto.setNombre("Producto Repo Test");
        producto.setPrecio(1000.0);
        producto.setStock(50);
        producto.setEstante(estante);
        producto = productoRepository.save(producto);
    }

    @Test
    @DisplayName("existsByListaIdAndProductoId — debe devolver true si existe")
    void existsByListaIdAndProductoId_shouldReturnTrueWhenExists() {
        ItemLista item = new ItemLista();
        item.setLista(lista);
        item.setProducto(producto);
        item.setCantidad(2);
        item.setRecogido(false);
        itemListaRepository.save(item);

        assertTrue(itemListaRepository
                .existsByListaIdAndProductoId(lista.getId(), producto.getId()));
    }

    @Test
    @DisplayName("existsByListaIdAndProductoId — debe devolver false si no existe")
    void existsByListaIdAndProductoId_shouldReturnFalseWhenNotExists() {
        assertFalse(itemListaRepository
                .existsByListaIdAndProductoId(lista.getId(), 9999L));
    }

    @Test
    @DisplayName("existsByProductoIdAndListaEstado — debe detectar producto en lista activa")
    void existsByProductoIdAndListaEstado_shouldDetectActiveList() {
        ItemLista item = new ItemLista();
        item.setLista(lista);
        item.setProducto(producto);
        item.setCantidad(1);
        item.setRecogido(false);
        itemListaRepository.save(item);

        assertTrue(itemListaRepository
                .existsByProductoIdAndListaEstado(
                        producto.getId(), ListaCompra.Estado.EN_PROCESO));
    }

    @Test
    @DisplayName("findByListaId — debe devolver todos los items de la lista")
    void findByListaId_shouldReturnAllItemsOfList() {
        ItemLista item = new ItemLista();
        item.setLista(lista);
        item.setProducto(producto);
        item.setCantidad(3);
        item.setRecogido(false);
        itemListaRepository.save(item);

        assertEquals(1, itemListaRepository.findByListaId(lista.getId()).size());
    }
}
