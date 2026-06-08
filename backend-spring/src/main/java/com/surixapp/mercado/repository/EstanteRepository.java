// repository/EstanteRepository.java
package com.surixapp.mercado.repository;

import com.surixapp.mercado.entity.Estante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EstanteRepository extends JpaRepository<Estante, Long> {
    List<Estante> findAllByOrderByOrdenLogicoAsc(); // ruta sugerida ordenada
    boolean existsByCoordXAndCoordY(Double coordX, Double coordY);
}