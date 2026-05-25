// repository/ItemListaRepository.java
package com.surixapp.mercado.repository;

import com.surixapp.mercado.entity.ItemLista;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemListaRepository extends JpaRepository<ItemLista, Long> {
    List<ItemLista> findByListaId(Long listaId);
}