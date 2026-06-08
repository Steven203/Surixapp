package com.surixapp.mercado.controller;

import com.surixapp.mercado.dto.AuthRequest;
import com.surixapp.mercado.dto.AuthResponse;
import com.surixapp.mercado.dto.CreateUsuarioRequest;
import com.surixapp.mercado.dto.UsuarioResponse;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

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
}