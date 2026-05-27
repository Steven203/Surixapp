package com.surixapp.mercado.service;

import com.surixapp.mercado.dto.*;
import java.util.List;

public interface RoleService {
    RoleResponse create(CreateRoleRequest request);
    List<RoleResponse> list();
}