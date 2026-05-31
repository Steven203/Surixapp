package com.surixapp.mercado.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "estantes")
public class Estante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "coord_x")
    private Double coordX;

    @Column(name = "coord_y")
    private Double coordY;

    @Column(name = "orden_logico")
    private Integer ordenLogico;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getCoordX() { return coordX; }
    public void setCoordX(Double coordX) { this.coordX = coordX; }
    public Double getCoordY() { return coordY; }
    public void setCoordY(Double coordY) { this.coordY = coordY; }
    public Integer getOrdenLogico() { return ordenLogico; }
    public void setOrdenLogico(Integer ordenLogico) { this.ordenLogico = ordenLogico; }
}