// exception/ResourceNotFoundException.java
package com.surixapp.mercado.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}