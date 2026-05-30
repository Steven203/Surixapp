package com.surixapp.mercado.exception;

import jakarta.servlet.http.HttpServletRequest;
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
        for (FieldError fe : ex.getBindingResult().getFieldErrors())
            fields.put(fe.getField(), fe.getDefaultMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("code", "VALIDATION_ERROR");
        body.put("message", "Request validation failed");
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(
            org.springframework.dao.DataIntegrityViolationException ex,
            HttpServletRequest req) {
        String message = "Violacion de integridad de datos, acción no permitida";

        String cause = ex.getMostSpecificCause().getMessage().toLowerCase();
        if (cause.contains("orden_logico"))
            message = "El orden lógico ya está en uso por otro estante";
        else if (cause.contains("estantes") && cause.contains("nombre"))
            message = "Ya existe un estante con ese nombre";
        else if (cause.contains("categoria") && cause.contains("nombre"))
            message = "Ya existe una categoría con ese nombre";
        else if (cause.contains("username"))
            message = "El username ya está en uso";

        Map<String, Object> body = new HashMap<>();
        body.put("code", "DUPLICATE_ERROR");
        body.put("message", message);
        body.put("timestamp", Instant.now());
        body.put("path", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

}