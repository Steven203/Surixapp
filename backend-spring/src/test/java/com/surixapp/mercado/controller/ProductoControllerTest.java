package com.surixapp.mercado.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surixapp.mercado.dto.request.CreateProductoRequest;
import com.surixapp.mercado.dto.request.AuthRequest;
import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.JsonNode;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProductoControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private EstanteRepository estanteRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String adminToken;
    private Long estanteId;
    private Long categoriaId;

    @BeforeEach
    void setUp() throws Exception {
        Role adminRole = new Role();
        adminRole.setNombre("ADMIN");
        adminRole = roleRepository.save(adminRole);

        Usuario admin = new Usuario();
        admin.setUsername("admin_productos_test");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.getRoles().add(adminRole);
        usuarioRepository.save(admin);

        Estante estante = new Estante();
        estante.setNombre("Estante Controller Test");
        estante.setCoordX(1.0);
        estante.setCoordY(1.0);
        estante.setOrdenLogico(99);
        estanteId = estanteRepository.save(estante).getId();

        Categoria categoria = new Categoria();
        categoria.setNombre("Categoria Controller Test");
        categoriaId = categoriaRepository.save(categoria).getId();

        // obtener token
        AuthRequest authRequest = new AuthRequest();
        authRequest.setUsername("admin_productos_test");
        authRequest.setPassword("admin123");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        adminToken = json.get("token").asText();
    }

    @Test
    @DisplayName("GET /api/productos — público, debe devolver lista")
    void list_shouldBePublicAndReturnList() throws Exception {
        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("POST /api/productos — sin token debe devolver 401")
    void create_shouldReturn401WithoutToken() throws Exception {
        mockMvc.perform(post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/productos — con token admin debe crear producto")
    void create_shouldCreateProductoWithAdminToken() throws Exception {
        CreateProductoRequest req = new CreateProductoRequest();
        req.setNombre("Producto Controller Test");
        req.setPrecio(2500.0);
        req.setStock(20);
        req.setEstanteId(estanteId);
        req.setCategoriaId(categoriaId);

        mockMvc.perform(post("/api/productos")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.nombre").value("Producto Controller Test"))
                .andExpect(jsonPath("$.stock").value(20));
    }

    @Test
    @DisplayName("POST /api/productos — campos inválidos deben devolver 400")
    void create_shouldReturn400WithInvalidData() throws Exception {
        mockMvc.perform(post("/api/productos")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "nombre": "",
                        "precio": -100
                    }
                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }
}
