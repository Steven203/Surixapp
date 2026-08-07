package com.surixapp.mercado.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("Surix App API")
            .version("1.0.0")
            .description("""
                API REST para sistema de gestión de supermercado con ruta de compra optimizada.

                ## Roles
                - **ADMIN** — gestión de productos, estantes, categorías y usuarios
                - **CLIENTE** — gestión de lista de compras personal

                ## Autenticación
                Usar el endpoint `/api/auth/login` para obtener el token JWT.
                Incluirlo en el header `Authorization: Bearer <token>`.
                """)
            .contact(new Contact()
                .name("Steven Rojas")
                .email("tu@email.com"))
            .license(new License()
                .name("MIT")))
        .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
        .components(new Components()
            .addSecuritySchemes("Bearer Auth", new SecurityScheme()
                .name("Bearer Auth")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")));
  }
}