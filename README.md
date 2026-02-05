# 🎵 Music Manager - Fullstack Challenge

## 📌 Sobre o Projeto
Plataforma fullstack para gerenciamento de artistas musicais e seus respectivos álbuns. Desenvolvido com foco em escalabilidade, utilizando arquitetura de microserviços em containers.

## 🚀 Tecnologias Utilizadas
- **Back-end:** Java 17 + Spring Boot 3
- **Front-end:** React + TypeScript + TailwindCSS
- **Banco de Dados:** PostgreSQL 15
- **Object Storage:** MinIO (S3 Compatible) para capas de álbuns
- **Infraestrutura:** Docker e Docker Compose

## 📐 Decisões Arquiteturais
1. **MinIO para Arquivos Estáticos:** Imagens de artistas e álbuns não são salvas no banco de dados. O PostgreSQL armazena apenas a URL de referência do objeto no MinIO. Isso melhora a performance de I/O do banco.
2. **Paginação e DTOs:** A API utiliza Spring Data Pageables e DTOs para tráfego de dados, garantindo que payloads grandes não travem o front-end.
3. **Orphan Removal:** Configurado no JPA para garantir que, ao deletar um artista, todos os seus álbuns (e arquivos no MinIO associados) sejam removidos.

## 📦 Como rodar o projeto

**Pré-requisitos:** Docker e Docker-compose instalados.

1. Clone o repositório.
2. Na raiz do projeto, execute o comando:
   `docker-compose up -d --build`
3. Acesse a aplicação:
   - **Front-end:** http://localhost:80
   - **API Back-end:** http://localhost:8080/swagger-ui.html
   - **MinIO Console:** http://localhost:9001 (User: admin / Pass: password123)