package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.*;

import com.surixapp.mercado.entity.*;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.*;
import com.surixapp.mercado.service.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              RoleRepository roleRepository) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UsuarioResponse create(CreateUsuarioRequest request) {
        Usuario u = new Usuario();
        u.setUsername(request.getUsername());
        u.setPassword(request.getPassword()); // en producción hashear con BCrypt
        return toResponse(usuarioRepository.save(u));
    }

    @Override
    public UsuarioResponse assignRole(Long usuarioId, Long roleId) {
        Usuario u = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario not found"));
        Role r = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        u.getRoles().add(r);
        return toResponse(usuarioRepository.save(u));
    }

    @Override
    public UsuarioResponse update(Long id, com.surixapp.mercado.dto.UpdateUsuarioRequest request) {
        Usuario existing = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario " + id + " not found"));

        existing.setUsername(request.getUsername());
        existing.setPassword(request.getPassword()); // en producción hashear con BCrypt

        return toResponse(usuarioRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id))
            throw new ResourceNotFoundException("Usuario " + id + " not found");
        usuarioRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> list() {

        return usuarioRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse getById(Long id) {
        return toResponse(usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario " + id + " not found")));
    }

    private UsuarioResponse toResponse(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.setId(u.getId());
        r.setUsername(u.getUsername());
        r.setRoles(u.getRoles().stream().map(Role::getNombre).toList());
        return r;
    }
}