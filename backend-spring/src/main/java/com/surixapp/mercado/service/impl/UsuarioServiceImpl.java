package com.surixapp.mercado.service.impl;

import com.surixapp.mercado.dto.CreateUsuarioRequest;
import com.surixapp.mercado.dto.UpdateUsuarioRequest;
import com.surixapp.mercado.dto.UsuarioResponse;
import com.surixapp.mercado.entity.ListaCompra;
import com.surixapp.mercado.entity.Role;
import com.surixapp.mercado.entity.Usuario;
import com.surixapp.mercado.exception.BusinessException;
import com.surixapp.mercado.exception.ResourceNotFoundException;
import com.surixapp.mercado.repository.ListaCompraRepository;
import com.surixapp.mercado.repository.RoleRepository;
import com.surixapp.mercado.repository.UsuarioRepository;
import com.surixapp.mercado.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ListaCompraRepository listaCompraRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            ListaCompraRepository listaCompraRepository) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.listaCompraRepository = listaCompraRepository;
    }

    @Override
    public UsuarioResponse create(CreateUsuarioRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BusinessException("El username ya existe");
        }

        Usuario u = new Usuario();
        u.setUsername(request.getUsername());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
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
    public UsuarioResponse removeRole(Long usuarioId, Long roleId) {
        Usuario u = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario not found"));
        Role r = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        if (!u.getRoles().contains(r))
            throw new BusinessException("El usuario no tiene ese rol");

        if (u.getRoles().size() == 1)
            throw new BusinessException("El usuario debe tener al menos un rol");

        u.getRoles().remove(r);
        return toResponse(usuarioRepository.save(u));
    }

    @Override
    public UsuarioResponse update(Long id, UpdateUsuarioRequest request) {
        Usuario existing = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario " + id + " not found"));

        existing.setUsername(request.getUsername());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponse(usuarioRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id))
            throw new ResourceNotFoundException("Usuario " + id + " not found");

        boolean tieneListaActiva = listaCompraRepository
                .existsByUsuarioIdAndEstado(id, ListaCompra.Estado.EN_PROCESO);

        if (tieneListaActiva)
            throw new BusinessException(
                    "No puedes eliminar este usuario porque tiene una lista de compras activa");

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