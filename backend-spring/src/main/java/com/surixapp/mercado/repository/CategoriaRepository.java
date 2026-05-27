package com.surixapp.mercado.repository;

import com.surixapp.mercado.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}