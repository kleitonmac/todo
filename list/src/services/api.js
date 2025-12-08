const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Função auxiliar para fazer requisições
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

// API de Tarefas
export const todosAPI = {
  // Buscar todas as tarefas
  getAll: async (userId = 'default') => {
    return fetchAPI(`/todos?userId=${userId}`);
  },

  // Buscar tarefa por ID
  getById: async (id) => {
    return fetchAPI(`/todos/${id}`);
  },

  // Criar nova tarefa
  create: async (todo) => {
    return fetchAPI('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  },

  // Atualizar tarefa
  update: async (id, todo, whatsappPhone = null) => {
    return fetchAPI(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...todo, whatsappPhone }),
    });
  },

  // Deletar tarefa
  delete: async (id) => {
    return fetchAPI(`/todos/${id}`, {
      method: 'DELETE',
    });
  },

  // Sincronizar múltiplas tarefas
  sync: async (todos, userId = 'default') => {
    return fetchAPI('/todos/sync', {
      method: 'POST',
      body: JSON.stringify({ todos, userId }),
    });
  },

  // Enviar lembrete via WhatsApp
  sendReminder: async (id, phoneNumber) => {
    return fetchAPI(`/todos/${id}/reminder`, {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  },
};

// Verificar status da API
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('API não disponível:', error);
    return null;
  }
};

