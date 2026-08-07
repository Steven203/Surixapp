package com.surixapp.mercado.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surixapp.mercado.dto.request.AuthRequest;
import com.surixapp.mercado.entity.Role;
import com.surixapp.mercado.entity.Usuario;
import com.surixapp.mercado.repository.RoleRepository;
import com.surixapp.mercado.repository.UsuarioRepository;
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
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setNombre("ADMIN");
        role = roleRepository.save(role);

        Usuario usuario = new Usuario();
        usuario.setUsername("admin_test");
        usuario.setPassword(passwordEncoder.encode("admin123"));
        usuario.getRoles().add(role);
        usuarioRepository.save(usuario);
    }

    @Test
    @DisplayName("Login — credenciales correctas deben devolver token JWT")
    void login_shouldReturnTokenWithValidCredentials() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setUsername("admin_test");
        request.setPassword("admin123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value("admin_test"))
                .andExpect(jsonPath("$.roles").isArray());
    }

    @Test
    @DisplayName("Login — credenciales incorrectas deben devolver 401")
    void login_shouldReturn401WithInvalidCredentials() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setUsername("admin_test");
        request.setPassword("wrong_password");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Login — body vacío debe devolver 400")
    void login_shouldReturn400WithEmptyBody() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Register — debe crear usuario con rol CLIENTE")
    void register_shouldCreateUserWithClienteRole() throws Exception {
        Role clienteRole = new Role();
        clienteRole.setNombre("CLIENTE");
        roleRepository.save(clienteRole);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "nuevo_cliente",
                        "password": "1234"
                    }
                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.roles[0]").value("CLIENTE"));
    }
}
