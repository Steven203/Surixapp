# ---- Etapa 1: Build ----
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# copiar archivos de dependencias primero (cache de Docker)
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
RUN chmod +x mvnw

# descargar dependencias (se cachea si pom.xml no cambia)
RUN ./mvnw dependency:go-offline -B

# copiar código fuente y compilar
COPY src ./src
RUN ./mvnw package -DskipTests

# ---- Etapa 2: Runtime ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# usuario no-root por seguridad
RUN addgroup -S surix && adduser -S surix -G surix
USER surix

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]