import axios from 'axios';

// Cria uma instância global do Axios
export const api = axios.create({
  // Aponta para a porta exposta pelo Spring Boot no Docker Compose
  baseURL: 'http://localhost:8080/api', 
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer SEU_TOKEN_AQUI' // Preparado para o futuro
  },
});

// Interceptor de Requisição (Request Interceptor)
// Útil para logar chamadas ou injetar tokens dinamicamente antes de saírem
api.interceptors.request.use(
  (config) => {
    // Exemplo: console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Response Interceptor)
// Útil para tratamento global de erros (ex: deslogar usuário se der 401)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status fora do range 2xx
      if (error.response.status === 401) {
        console.error('Sessão expirada. Redirecionando para login...');
      } else if (error.response.status === 500) {
        console.error('Erro interno do servidor backend.');
      }
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta (Backend fora do ar)
      console.error('Servidor indisponível. Verifique se o Docker está rodando.');
    }
    return Promise.reject(error); // Repassa o erro para o componente tratar
  }
);