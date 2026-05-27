package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;
import com.surixapp.mercado.entity.Role;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.RoleRepository;
import com.surixapp.mercado.service.RoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository repository;

    public RoleServiceImpl(RoleRepository repository) {
        this.repository = repository;
    }

    @Override
    public RoleResponse create(CreateRoleRequest request) {
        Role r = new Role();
        r.setNombre(request.getNombre());
        return toResponse(repository.save(r));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> list() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    private RoleResponse toResponse(Role r) {
        RoleResponse res = new RoleResponse();
        res.setId(r.getId());
        res.setNombre(r.getNombre());
        return res;
    }
}