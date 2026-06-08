package com.surixapp.mercado.config;

import com.surixapp.mercado.entity.Role;
import com.surixapp.mercado.entity.Usuario;
import com.surixapp.mercado.repository.RoleRepository;
import com.surixapp.mercado.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByNombre("ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setNombre("ADMIN");
                    return roleRepository.save(role);
                });

        roleRepository.findByNombre("CLIENTE")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setNombre("CLIENTE");
                    return roleRepository.save(role);
                });

        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));

            usuarioRepository.save(admin);
        }
    }
}