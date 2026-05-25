// dto/CreateUsuarioRequest.java
package com.surixapp.mercado.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateUsuarioRequest {
    @NotBlank(message = "username is required")
    private String username;
    @NotBlank(message = "password is required")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}