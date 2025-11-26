import './App.css'
import { useState, useEffect } from 'react'
import Todo from './components/Todo';
import TodoForm from './components/TodoForm';
import Search from './components/Search';
import Filter from './components/Filter';

function App() {
  const [todos, setTodos] = useState([])
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");

  // Carregar todos do localStorage quando o componente montar
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Dados iniciais apenas se não houver dados salvos
      const initialTodos = [
        { 
          id: 1, 
          text: 'Criar funcionalidade X no sistema',
          category: 'Trabalho',
          isCompleted: false 
        },
        { 
          id: 2, 
          text: 'Fazer compras', 
          category: 'Pessoal',
          isCompleted: false 
        },
        { 
          id: 3, 
          text: 'Estudar para a prova de matemática', 
          category: 'Estudos',
          isCompleted: false 
        }
      ];
      setTodos(initialTodos);
    }
  }, []);

  // Salvar todos no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, category) => {
    const newTodos = [...todos, {
      id: Math.floor(Math.random() * 10000), // Aumentei o range para evitar colisões
      text,
      category,
      isCompleted: false,
    }];
    setTodos(newTodos);
  };

  const removeTodo = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  };

  const completeTodo = (id) => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newTodos);
  };

  // Função para limpar todos os dados (opcional)
  const clearAllTodos = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as tarefas?')) {
      setTodos([]);
      localStorage.removeItem('todos');
    }
  };

  // Filtrar e ordenar os todos
  const filteredAndSortedTodos = todos
    .filter((todo) => 
      filter === "All" 
        ? true 
        : filter === "completed" 
        ? todo.isCompleted 
        : !todo.isCompleted
    )
    .filter((todo) => 
      todo.text.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => 
      sort === "Asc" 
        ? a.text.localeCompare(b.text) 
        : b.text.localeCompare(a.text)
    );

  return (
    <div className='app'>
      <h1>Lista de Tarefas</h1>
      
      {/* Botão para limpar todos (opcional) */}
      {todos.length > 0 && (
        <button 
          onClick={clearAllTodos}
          style={{
            backgroundColor: '#ff6b6b',
            marginBottom: '20px',
            padding: '8px 16px'
          }}
        >
          Limpar Todas as Tarefas
        </button>
      )}
      
      <Search search={search} setSearch={setSearch}/>
      <Filter filter={filter} setFilter={setFilter} setSort={setSort} />
      
      <div className='todo-list'>
        {filteredAndSortedTodos.length > 0 ? (
          filteredAndSortedTodos.map((todo) => (
            <Todo 
              key={todo.id} 
              todo={todo} 
              removeTodo={removeTodo} 
              completeTodo={completeTodo} 
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>
            {search || filter !== "All" 
              ? "Nenhuma tarefa encontrada com os filtros atuais." 
              : "Nenhuma tarefa cadastrada. Adicione uma nova tarefa!"}
          </p>
        )}
      </div>
      
      <TodoForm addTodo={addTodo} />
    </div>
  );
}

export default App;