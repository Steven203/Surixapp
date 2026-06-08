package com.surixapp.mercado.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private Long id;
    private String username;
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