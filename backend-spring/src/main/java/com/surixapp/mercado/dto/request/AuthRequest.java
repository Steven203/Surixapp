package com.surixapp.mercado.dto.request;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Credenciales de inicio de sesión")
public class AuthRequest {
    @Schema(description = "Nombre de usuario", example = "Juan")
    @NotBlank(message = "username is required")
    private String username;
    
    @Schema(description = "Contraseña", example = "1234")
    @NotBlank(message = "password is required")
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}