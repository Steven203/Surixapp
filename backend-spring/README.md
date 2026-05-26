# backend-spring

Spring Boot backend para la aplicación `mercado`.

## Requisitos
- Java 21
- Maven 3.9+
- PostgreSQL 14+

## Configuración de entorno local
1. Copia el archivo de ejemplo:
   ```powershell
   copy .env.example .env.local
   ```
2. Ajusta los valores de conexión en `backend-spring/.env.local`.

## Ejemplo de variables de entorno
El backend lee estas variables desde el entorno:

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mercado_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=secret
```

## Ejecución
- Windows: `mvnw.cmd spring-boot:run`
- Linux/macOS: `./mvnw spring-boot:run`

## Build
```bash
./mvnw clean package
java -jar target/mercado-0.0.1-SNAPSHOT.jar
```

## Endpoints locales
- API base: `http://localhost:8080`

## Notas
- `backend-spring/.env.local` debe permanecer fuera del control de versiones.
- `backend-spring/.env.example` se usa como plantilla para crear el archivo local.
- Para desarrollo local, puedes mantener `spring.jpa.hibernate.ddl-auto=update` si quieres que Hibernate actualice el esquema automáticamente.
