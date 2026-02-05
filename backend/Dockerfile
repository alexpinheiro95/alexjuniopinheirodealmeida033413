# ESTÁGIO 1: Build da aplicação (Compilação)
# Usamos uma imagem com o Maven e o JDK completos.
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copia apenas o pom.xml primeiro para aproveitar o cache do Docker nas dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código fonte e compila o JAR final, ignorando os testes para agilizar o build
COPY src ./src
RUN mvn clean package -DskipTests

# -----------------------------------------------------------------------------
# ESTÁGIO 2: Execução (Produção)
# Usamos apenas o JRE (Java Runtime Environment) que é muito mais leve.
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Boas práticas de segurança: Criar um usuário não-root para rodar a aplicação
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copia apenas o arquivo .jar gerado no estágio anterior
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Inicia a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]