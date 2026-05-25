// service/UsuarioService.java
package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.*;
import java.util.List;

public interface UsuarioService {
    UsuarioResponse create(CreateUsuarioRequest request);

    UsuarioResponse assignRole(Long usuarioId, Long roleId);

    List<UsuarioResponse> list();

    UsuarioResponse getById(Long id);
}