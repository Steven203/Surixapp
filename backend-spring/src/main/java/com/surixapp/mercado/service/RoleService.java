package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.request.*;
import com.surixapp.mercado.dto.response.RoleResponse;

import java.util.List;

public interface RoleService {
    RoleResponse create(CreateRoleRequest request);
    List<RoleResponse> list();
}