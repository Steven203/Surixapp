package com.surixapp.mercado.repository;

import com.surixapp.mercado.entity.ListaCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListaCompraRepository extends JpaRepository<ListaCompra, Long> {
    List<ListaCompra> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioIdAndEstado(Long usuarioId, ListaCompra.Estado estado);
}