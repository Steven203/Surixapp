package com.surixapp.mercado.dto.request;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Cambio de contraseña del usuario autenticado")
public class CambiarPasswordRequest {

    @Schema(description = "Contraseña actual", example = "1234")
    @NotBlank(message = "passwordActual es requerida")
    private String passwordActual;

    @Schema(description = "Nueva contraseña", example = "4321")
    @NotBlank(message = "nuevaContraseña es requerida")
    private String nuevaContraseña;

    public String getPasswordActual() { return passwordActual; }
    public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }

    public String getNuevaContraseña() { return nuevaContraseña; }
    public void setNuevaContraseña(String nuevaContraseña) { this.nuevaContraseña = nuevaContraseña; }
}
