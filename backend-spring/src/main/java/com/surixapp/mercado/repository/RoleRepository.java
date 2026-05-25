// repository/RoleRepository.java
package com.surixapp.mercado.repository;

import com.surixapp.mercado.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}