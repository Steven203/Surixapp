package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.request.CreateProductoRequest;
import com.surixapp.mercado.dto.response.ProductoResponse;
import com.surixapp.mercado.entity.Categoria;
import com.surixapp.mercado.entity.Estante;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.CategoriaRepository;
import com.surixapp.mercado.repository.EstanteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProductoServiceTest {

    @Autowired private ProductoService productoService;
    @Autowired private EstanteRepository estanteRepository;
    @Autowired private CategoriaRepository categoriaRepository;

    private Estante estante;
    private Categoria categoria;

    @BeforeEach
    void setUp() {
        estante = new Estante();
        estante.setNombre("Estante Test");
        estante.setCoordX(1.0);
        estante.setCoordY(1.0);
        estante.setOrdenLogico(1);
        estante = estanteRepository.save(estante);

        categoria = new Categoria();
        categoria.setNombre("Categoria Test");
        categoria = categoriaRepository.save(categoria);
    }

    private CreateProductoRequest buildRequest(String nombre) {
        CreateProductoRequest req = new CreateProductoRequest();
        req.setNombre(nombre);
        req.setPrecio(3500.0);
        req.setStock(50);
        req.setEstanteId(estante.getId());
        req.setCategoriaId(categoria.getId());
        return req;
    }

    @Test
    @DisplayName("Crear producto — debe guardar y devolver response completo")
    void create_shouldSaveAndReturnResponse() {
        ProductoResponse result = productoService.create(buildRequest("Leche"));

        assertNotNull(result.getId());
        assertEquals("Leche", result.getNombre());
        assertEquals(3500.0, result.getPrecio());
        assertEquals(50, result.getStock());
        assertEquals(estante.getNombre(), result.getEstanteNombre());
        assertEquals(categoria.getNombre(), result.getCategoriaNombre());
    }

    @Test
    @DisplayName("Crear producto — sin estante debe lanzar ResourceNotFoundException")
    void create_shouldThrowWhenEstanteNotFound() {
        CreateProductoRequest req = buildRequest("Arroz");
        req.setEstanteId(9999L);

        assertThrows(ResourceNotFoundException.class, () -> productoService.create(req));
    }

    @Test
    @DisplayName("Listar productos — debe devolver todos")
    void list_shouldReturnAllProductos() {
        productoService.create(buildRequest("Leche"));
        productoService.create(buildRequest("Arroz"));

        List<ProductoResponse> result = productoService.list();

        assertTrue(result.size() >= 2);
    }

    @Test
    @DisplayName("Obtener por ID — debe devolver el producto correcto")
    void getById_shouldReturnCorrectProducto() {
        ProductoResponse created = productoService.create(buildRequest("Yogur"));

        ProductoResponse found = productoService.getById(created.getId());

        assertEquals(created.getId(), found.getId());
        assertEquals("Yogur", found.getNombre());
    }

    @Test
    @DisplayName("Obtener por ID — ID inexistente debe lanzar ResourceNotFoundException")
    void getById_shouldThrowWhenNotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> productoService.getById(9999L));
    }

    @Test
    @DisplayName("Actualizar producto — debe modificar los campos correctamente")
    void update_shouldModifyProducto() {
        ProductoResponse created = productoService.create(buildRequest("Leche"));

        CreateProductoRequest updateReq = buildRequest("Leche Descremada");
        updateReq.setPrecio(4000.0);
        updateReq.setStock(30);

        ProductoResponse updated = productoService.update(created.getId(), updateReq);

        assertEquals("Leche Descremada", updated.getNombre());
        assertEquals(4000.0, updated.getPrecio());
        assertEquals(30, updated.getStock());
    }

    @Test
    @DisplayName("Eliminar producto — debe eliminarlo correctamente")
    void delete_shouldRemoveProducto() {
        ProductoResponse created = productoService.create(buildRequest("Mantequilla"));

        productoService.delete(created.getId());

        assertThrows(ResourceNotFoundException.class,
                () -> productoService.getById(created.getId()));
    }

    @Test
    @DisplayName("Eliminar producto — ID inexistente debe lanzar ResourceNotFoundException")
    void delete_shouldThrowWhenNotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> productoService.delete(9999L));
    }
}
