package com.surixapp.mercado.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", "NOT_FOUND");
        body.put("message", ex.getMessage());
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<Map<String, Object>> handleAuth(
            AuthException ex, HttpServletRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", "UNAUTHORIZED");
        body.put("message", ex.getMessage());
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusiness(
            BusinessException ex, HttpServletRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", "BUSINESS_ERROR");
        body.put("message", ex.getMessage());
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fields = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fields.put(fe.getField(), fe.getDefaultMessage());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("code", "VALIDATION_ERROR");
        body.put("message", "Request validation failed");
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotAllowed(
            org.springframework.web.HttpRequestMethodNotSupportedException ex,
            HttpServletRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", "METHOD_NOT_ALLOWED");
        body.put("message", "Método HTTP no permitido: " + ex.getMethod());
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(body);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(
            org.springframework.dao.DataIntegrityViolationException ex, HttpServletRequest req) {

        String raw = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage().toLowerCase()
                : ex.getMessage().toLowerCase();

        String message = "Violación de integridad de datos";

        // 1. PRIMERO: Evaluar restricciones de unicidad / duplicados
        if (raw.contains("orden_logico")) {
            message = "El orden lógico ya está en uso por otro estante";
        } else if (raw.contains("username")) {
            message = "El username ya está en uso";
        } else if (raw.contains("estantes") && raw.contains("nombre")) {
            message = "Ya existe un estante con ese nombre";
        } else if (raw.contains("categoria") && raw.contains("nombre")) {
            message = "Ya existe una categoría con ese nombre";
        } else if (raw.contains("productos") && raw.contains("nombre")) {
            message = "Ya existe un producto con ese nombre";
        }
        // 2. SEGUNDO: Evaluar restricciones de claves foráneas (eliminación)
        else if (raw.contains("fk_producto_estante") || raw.contains("estante")) {
            message = "No se puede eliminar el estante porque tiene productos asociados";
        } else if (raw.contains("fk_producto_categoria") || raw.contains("categoria")) {
            message = "No se puede eliminar la categoría porque tiene productos asociados";
        } else if (raw.contains("fk_lista_usuario") || raw.contains("usuario")) {
            message = "No se puede eliminar el usuario porque tiene listas asociadas";
        } else if (raw.contains("fk_lista_producto") || raw.contains("producto")) {
            message = "No se puede eliminar el producto porque está en una lista";
        }

        Map<String, Object> body = new HashMap<>();
        body.put("code", "DUPLICATE_ERROR".equals(message) ? "DUPLICATE_ERROR" : "INTEGRITY_VIOLATION");
        body.put("message", message);
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }
}