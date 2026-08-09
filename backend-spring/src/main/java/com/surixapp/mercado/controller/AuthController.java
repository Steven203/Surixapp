package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.request.AuthRequest;
import com.surixapp.mercado.dto.request.CambiarPasswordRequest;
import com.surixapp.mercado.dto.request.CreateUsuarioRequest;
import com.surixapp.mercado.dto.response.AuthResponse;
import com.surixapp.mercado.dto.response.UsuarioResponse;
import com.surixapp.mercado.entity.Role;
import com.surixapp.mercado.entity.Usuario;
import com.surixapp.mercado.exception.AuthException;
import com.surixapp.mercado.repository.RoleRepository;
import com.surixapp.mercado.repository.UsuarioRepository;
import com.surixapp.mercado.security.JwtService;
import com.surixapp.mercado.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Autenticación", description = "Login y registro de usuarios")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthenticationManager authManager;
        private final JwtService jwtService;
        private final UsuarioService usuarioService;
        private final UsuarioRepository usuarioRepository;
        private final RoleRepository roleRepository;

        public AuthController(AuthenticationManager authManager,
                        JwtService jwtService,
                        UsuarioService usuarioService,
                        UsuarioRepository usuarioRepository,
                        RoleRepository roleRepository) {
                this.authManager = authManager;
                this.jwtService = jwtService;
                this.usuarioService = usuarioService;
                this.usuarioRepository = usuarioRepository;
                this.roleRepository = roleRepository;
        }

        @Operation(summary = "Iniciar sesión", description = "Autentica al usuario y devuelve un token JWT")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Login exitoso"),
                        @ApiResponse(responseCode = "401", description = "Usuario o contraseña inválidos")
        })
        @PostMapping("/login")
        public AuthResponse login(@Valid @RequestBody AuthRequest request) {
                try {
                        Authentication auth = authManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getUsername(),
                                                        request.getPassword()));

                        Usuario usuario = (Usuario) auth.getPrincipal();
                        String token = jwtService.generateToken(usuario);
                        List<String> roles = usuario.getRoles().stream()
                                        .map(Role::getNombre)
                                        .toList();

                        return new AuthResponse(token, usuario.getId(), usuario.getUsername(), roles);
                } catch (BadCredentialsException ex) {
                        throw new AuthException("Usuario o contraseña inválidos");
                }
        }

        @Operation(summary = "Registrarse", description = "Crea una cuenta nueva y asigna automáticamente el rol CLIENTE")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Cuenta creada correctamente"),
                        @ApiResponse(responseCode = "400", description = "Datos de registro inválidos"),
                        @ApiResponse(responseCode = "409", description = "El username ya existe")
        })
        @PostMapping("/register")
        @ResponseStatus(HttpStatus.CREATED)
        public AuthResponse register(@Valid @RequestBody CreateUsuarioRequest request) {
                UsuarioResponse creado = usuarioService.create(request);

                Role clienteRole = roleRepository.findByNombre("CLIENTE")
                                .orElseThrow(() -> new AuthException("Rol CLIENTE no existe"));

                usuarioService.assignRole(creado.getId(), clienteRole.getId());

                Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new AuthException("Usuario no encontrado tras registrar"));

                String token = jwtService.generateToken(usuario);
                List<String> roles = usuario.getRoles().stream()
                                .map(Role::getNombre)
                                .toList();

                return new AuthResponse(token, usuario.getId(), usuario.getUsername(), roles);
        }

        @Operation(summary = "Cambiar contraseña", description = "Permite al usuario autenticado cambiar su propia contraseña")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Contraseña actualizada"),
                        @ApiResponse(responseCode = "400", description = "Contraseña actual incorrecta")
        })
        @PatchMapping("/cambiar-password")
        public void cambiarPassword(@Valid @RequestBody CambiarPasswordRequest request) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Usuario usuario = (Usuario) auth.getPrincipal();
                usuarioService.cambiarPassword(
                                usuario.getId(),
                                request.getPasswordActual(),
                                request.getNuevaContraseña());
        }
}
