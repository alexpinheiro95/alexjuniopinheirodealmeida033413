# ESTÁGIO 1: Build da aplicação React
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de configuração de dependências
COPY package*.json ./

# Instala as dependências de forma limpa e otimizada
RUN npm ci

# Copia o restante do código e faz o build (gera a pasta /dist ou /build)
COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# ESTÁGIO 2: Servidor Web (Nginx)
FROM nginx:alpine

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos gerados no estágio anterior para a pasta pública do Nginx
# Nota: Se estiver usando Create React App, mude /app/dist para /app/build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração para SPAs (Single Page Applications)
# Isso garante que o React Router funcione ao atualizar a página (evita erro 404)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]