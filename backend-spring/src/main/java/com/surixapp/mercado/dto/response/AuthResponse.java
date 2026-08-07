package com.surixapp.mercado.dto.response;

import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de autenticación con token JWT")
public class AuthResponse {
   @Schema(description = "Token JWT para incluir en Authorization header")
    private String token;

    @Schema(description = "ID del usuario", example = "1")
    private Long id;

    @Schema(description = "Nombre de usuario", example = "Juan")
    private String username;

    @Schema(description = "Roles asignados", example = "[\"ADMIN\"]")
    private List<String> roles;

    public AuthResponse(String token, Long id, String username, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public List<String> getRoles() { return roles; }
}