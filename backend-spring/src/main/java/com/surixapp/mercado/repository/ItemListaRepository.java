// repository/ItemListaRepository.java
package com.surixapp.mercado.repository;

import com.surixapp.mercado.entity.ItemLista;
import com.surixapp.mercado.entity.ListaCompra;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemListaRepository extends JpaRepository<ItemLista, Long> {
    List<ItemLista> findByListaId(Long listaId);

    boolean existsByProductoId(Long productoId);

    boolean existsByListaIdAndProductoId(Long listaId, Long productoId);

    boolean existsByProductoIdAndListaEstado(Long productoId, ListaCompra.Estado estado);

    boolean existsByProductoEstanteIdAndListaEstado(Long estanteId, ListaCompra.Estado estado);

    boolean existsByProductoCategoriaIdAndListaEstado(Long categoriaId, ListaCompra.Estado estado);
}