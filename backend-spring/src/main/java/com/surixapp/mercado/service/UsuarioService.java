package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.request.CreateUsuarioRequest;
import com.surixapp.mercado.dto.request.UpdateUsuarioRequest;
import com.surixapp.mercado.dto.response.UsuarioResponse;

import java.util.List;

public interface UsuarioService {
    UsuarioResponse create(CreateUsuarioRequest request);

    UsuarioResponse assignRole(Long usuarioId, Long roleId);

    UsuarioResponse removeRole(Long usuarioId, Long roleId);

    List<UsuarioResponse> list();

    UsuarioResponse getById(Long id);

    UsuarioResponse update(Long id, UpdateUsuarioRequest request);

    void cambiarPassword(Long usuarioId, String passwordActual, String nuevaContraseña);

    void delete(Long id);

}
