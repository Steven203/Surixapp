package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.request.CreateListaCompraRequest;
import com.surixapp.mercado.dto.response.ListaCompraResponse;
import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ListaCompraServiceTest {

    @Autowired private ListaCompraService listaService;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setNombre("CLIENTE");
        role = roleRepository.save(role);

        usuario = new Usuario();
        usuario.setUsername("cliente_test");
        usuario.setPassword(passwordEncoder.encode("1234"));
        usuario.getRoles().add(role);
        usuario = usuarioRepository.save(usuario);
    }

    private CreateListaCompraRequest buildRequest() {
        CreateListaCompraRequest req = new CreateListaCompraRequest();
        req.setUsuarioId(usuario.getId());
        return req;
    }

    @Test
    @DisplayName("Crear lista — debe crear con estado EN_PROCESO")
    void create_shouldCreateWithEnProcesoEstado() {
        ListaCompraResponse result = listaService.create(buildRequest());

        assertNotNull(result.getId());
        assertEquals("EN_PROCESO", result.getEstado());
        assertEquals(usuario.getId(), result.getUsuarioId());
    }

    @Test
    @DisplayName("Crear lista — no debe permitir dos listas activas del mismo usuario")
    void create_shouldThrowWhenUserAlreadyHasActiveList() {
        listaService.create(buildRequest());

        assertThrows(BusinessException.class,
                () -> listaService.create(buildRequest()));
    }

    @Test
    @DisplayName("Listar por usuario — debe devolver todas sus listas")
    void listByUsuario_shouldReturnAllUserLists() {
        listaService.create(buildRequest());

        List<ListaCompraResponse> listas = listaService.listByUsuario(usuario.getId());

        assertEquals(1, listas.size());
    }

    @Test
    @DisplayName("Finalizar lista — debe cambiar estado a FINALIZADA")
    void finalizar_shouldChangeEstadoToFinalizada() {
        ListaCompraResponse lista = listaService.create(buildRequest());

        ListaCompraResponse finalizada = listaService.finalizar(lista.getId(), true);

        assertEquals("FINALIZADA", finalizada.getEstado());
    }

    @Test
    @DisplayName("Finalizar lista — no debe permitir finalizar una ya finalizada")
    void finalizar_shouldThrowWhenAlreadyFinalizada() {
        ListaCompraResponse lista = listaService.create(buildRequest());
        listaService.finalizar(lista.getId(), true);

        assertThrows(BusinessException.class,
                () -> listaService.finalizar(lista.getId(), true));
    }

    @Test
    @DisplayName("Eliminar lista — debe eliminarla si está vacía")
    void delete_shouldDeleteEmptyList() {
        ListaCompraResponse lista = listaService.create(buildRequest());

        listaService.delete(lista.getId());

        assertThrows(ResourceNotFoundException.class,
                () -> listaService.getById(lista.getId()));
    }
}
