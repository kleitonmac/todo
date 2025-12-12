import './App.css'
import { useState, useEffect } from 'react'
import { TbList, TbTrash, TbCalendar, TbListCheck, TbBell, TbAlertTriangle, TbBrandWhatsapp } from 'react-icons/tb';
import Todo from './components/Todo';
import TodoForm from './components/TodoForm';
import Search from './components/Search';
import Filter from './components/Filter';
import Calendar from './components/Calendar';
import { todosAPI, checkAPIHealth } from './services/api';

function App() {
  const [todos, setTodos] = useState([])
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");
  const [showCalendar, setShowCalendar] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [apiAvailable, setApiAvailable] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState(
    localStorage.getItem('whatsappPhone') || ''
  );

  // Verificar se API está disponível e carregar tarefas
  useEffect(() => {
    const loadTodos = async () => {
      // Primeiro, verificar API
      const health = await checkAPIHealth();
      const isApiAvailable = health !== null;
      setApiAvailable(isApiAvailable);

      // Carregar do localStorage para exibição imediata
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        const normalizedTodos = parsedTodos.map(todo => ({
          ...todo,
          dueDate: todo.dueDate || null,
          reminderEnabled: todo.reminderEnabled || false,
          reminderTime: todo.reminderTime || null,
          lastReminderSent: todo.lastReminderSent || null,
        }));
        setTodos(normalizedTodos);
      }

      // Tentar sincronizar com API
      if (isApiAvailable) {
        try {
          setSyncing(true);
          const apiTodos = await todosAPI.getAll();
          
          // Se há tarefas na API, usar elas (mais atualizadas)
          if (apiTodos && apiTodos.length > 0) {
            setTodos(apiTodos);
            localStorage.setItem('todos', JSON.stringify(apiTodos));
          } else if (savedTodos) {
            // Se não há na API mas há no localStorage, enviar para API
            const parsedTodos = JSON.parse(savedTodos);
            await todosAPI.sync(parsedTodos);
          }
        } catch (error) {
          console.error('Erro ao sincronizar com API:', error);
          // Continuar usando localStorage se API falhar
        } finally {
          setSyncing(false);
        }
      }
    };

    loadTodos();
  }, []);


  // Salvar todos no localStorage e sincronizar com API
  useEffect(() => {
    // Evitar sincronização no carregamento inicial
    if (todos.length === 0 || syncing) return;
    
    // Sempre salvar no localStorage
    localStorage.setItem('todos', JSON.stringify(todos));

    // Sincronizar com API se disponível (com debounce)
    if (apiAvailable) {
      const syncTimeout = setTimeout(async () => {
        try {
          // Normalizar dados antes de enviar
          const normalizedTodos = todos.map(todo => ({
            _id: todo._id || null,
            text: todo.text,
            category: todo.category,
            isCompleted: todo.isCompleted || false,
            dueDate: todo.dueDate || null,
            reminderEnabled: todo.reminderEnabled || false,
            reminderTime: todo.reminderTime || null,
            lastReminderSent: todo.lastReminderSent || null,
            createdAt: todo.createdAt || new Date().toISOString(),
            id: todo.id || todo._id, // Manter ID local
          })).filter(todo => todo.text && todo.category); // Filtrar inválidos

          if (normalizedTodos.length > 0) {
            await todosAPI.sync(normalizedTodos);
          }
        } catch (error) {
          console.error('Erro ao sincronizar com API:', error);
        }
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(syncTimeout);
    }
  }, [todos, apiAvailable, syncing]);

  // Função para enviar alerta via WhatsApp
  const sendWhatsAppReminder = (todo) => {
    const message = encodeURIComponent(
      `⏰ *Lembrete de Tarefa*\n\n` +
      `*Tarefa:* ${todo.text}\n` +
      `*Categoria:* ${todo.category}\n` +
      `${todo.dueDate ? `*Prazo:* ${new Date(todo.dueDate).toLocaleDateString('pt-BR')}\n` : ''}` +
      `${todo.isCompleted ? '✅ *Status:* Completa' : '⏳ *Status:* Pendente'}\n\n` +
      `Acesse o site para completar esta tarefa!`
    );
    
    // ⚠️ IMPORTANTE: Configure seu número do WhatsApp aqui
    // Formato: código do país + DDD + número (sem espaços, parênteses, hífens ou caracteres especiais)
    // Exemplo para Brasil: 5511999999999 (55 = código do país, 11 = DDD, 999999999 = número)
    // Exemplo para EUA: 15551234567 (1 = código do país, 5551234567 = número)
    const phoneNumber = '5527981911375'; // 👈 SUBSTITUA AQUI pelo seu número
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Sistema de lembretes
  useEffect(() => {
    // Atualizar estado da permissão
    if (typeof Notification !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    const checkReminders = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (todo.isCompleted || !todo.reminderEnabled) return;

        // Se tem data de vencimento, verificar lembretes baseados nela
        if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(23, 59, 59, 999); // Fim do dia
          
          // Se a data de vencimento já passou e a tarefa não está completa, enviar lembrete diário
          if (now <= dueDate) {
            const reminderTime = todo.reminderTime ? new Date(todo.reminderTime) : new Date(dueDate.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes
            
            if (now >= reminderTime) {
              const lastReminder = todo.lastReminderSent ? new Date(todo.lastReminderSent) : null;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              if (!lastReminder || lastReminder < today) {
                sendReminder(todo);
              }
            }
          } else if (now > dueDate) {
            // Tarefa vencida - enviar lembrete diário até ser completada
            const lastReminder = todo.lastReminderSent ? new Date(todo.lastReminderSent) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!lastReminder || lastReminder < today) {
              sendReminder(todo, true);
            }
          }
        } else if (todo.reminderTime) {
          // Se tem apenas horário de lembrete (sem data de vencimento)
          const reminderTime = new Date(todo.reminderTime);
          if (now >= reminderTime) {
            const lastReminder = todo.lastReminderSent ? new Date(todo.lastReminderSent) : null;
            const reminderDate = new Date(reminderTime);
            reminderDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!lastReminder || (lastReminder < reminderDate && today >= reminderDate)) {
              sendReminder(todo);
            }
          }
        }
      });
    };

    const sendReminder = (todo, isOverdue = false) => {
      if (typeof Notification !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const message = isOverdue 
            ? `⚠️ Tarefa Atrasada: ${todo.text}`
            : `⏰ Lembrete: ${todo.text}`;
          
          const body = `Categoria: ${todo.category}${todo.dueDate ? `\nPrazo: ${new Date(todo.dueDate).toLocaleDateString('pt-BR')}` : ''}${isOverdue ? '\n⚠️ Esta tarefa está atrasada!' : ''}`;
          
          const notification = new Notification(message, {
            body: body,
            icon: '/public/icons.jpg',
            tag: `todo-${todo.id}`,
            requireInteraction: true,
          });

          // Adicionar ação para abrir WhatsApp quando clicar na notificação
          notification.onclick = () => {
            sendWhatsAppReminder(todo);
            window.focus();
          };
        } catch (error) {
          console.error('Erro ao enviar notificação:', error);
        }
      }

      // Enviar também via WhatsApp se configurado
      const whatsappEnabled = localStorage.getItem('whatsappReminders') === 'true';
      if (whatsappEnabled) {
        sendWhatsAppReminder(todo);
      }

      // Atualizar último lembrete enviado
      setTodos(prevTodos => 
        prevTodos.map(t => 
          t.id === todo.id 
            ? { ...t, lastReminderSent: new Date().toISOString() }
            : t
        )
      );
    };

    // Verificar lembretes a cada minuto
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Verificar imediatamente

    return () => clearInterval(interval);
  }, [todos]);

  const addTodo = async (text, category, dueDate = null, reminderEnabled = false, reminderTime = null) => {
    if (!text || !text.trim() || !category) {
      console.error('Tentativa de adicionar tarefa inválida');
      return;
    }
    
    const newTodo = {
      id: Math.floor(Math.random() * 100000),
      text: text.trim(),
      category,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null,
      reminderEnabled: reminderEnabled || false,
      reminderTime: reminderTime || null,
      lastReminderSent: null,
    };

    // Adicionar localmente primeiro (otimista)
    setTodos(prevTodos => [...prevTodos, newTodo]);

    // Sincronizar com API se disponível
    if (apiAvailable) {
      try {
        const savedTodo = await todosAPI.create(newTodo);
        // Atualizar com ID do banco se retornado
        if (savedTodo && savedTodo._id) {
          setTodos(prevTodos => 
            prevTodos.map(t => 
              t.id === newTodo.id 
                ? { ...t, _id: savedTodo._id, ...savedTodo }
                : t
            )
          );
        }
      } catch (error) {
        console.error('Erro ao salvar tarefa na API:', error);
        // Continuar usando versão local
      }
    }
  };

  const editTodo = async (id, text, category, dueDate = null, reminderEnabled = false, reminderTime = null) => {
    if (!text || !text.trim() || !category) {
      console.error('Tentativa de editar tarefa com dados inválidos');
      return;
    }
    
    const updatedTodo = {
      text: text.trim(),
      category,
      dueDate: dueDate !== undefined && dueDate !== null ? dueDate : (dueDate === null ? null : undefined),
      reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : undefined,
      reminderTime: reminderTime !== undefined && reminderTime !== null ? reminderTime : (reminderTime === null ? null : undefined),
      updatedAt: new Date().toISOString()
    };

    // Atualizar localmente primeiro
    const newTodos = todos.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            ...updatedTodo,
            dueDate: updatedTodo.dueDate !== undefined ? updatedTodo.dueDate : todo.dueDate,
            reminderEnabled: updatedTodo.reminderEnabled !== undefined ? updatedTodo.reminderEnabled : todo.reminderEnabled,
            reminderTime: updatedTodo.reminderTime !== undefined ? updatedTodo.reminderTime : todo.reminderTime,
          }
        : todo
    );
    setTodos(newTodos);

    // Sincronizar com API
    if (apiAvailable) {
      try {
        const todo = todos.find(t => t.id === id);
        const dbId = todo?._id || todo?.id;
        if (dbId) {
          await todosAPI.update(dbId, updatedTodo, whatsappPhone);
        }
      } catch (error) {
        console.error('Erro ao atualizar tarefa na API:', error);
      }
    }
  };

  const removeTodo = async (id) => {
    // Remover localmente primeiro
    const todo = todos.find(t => t.id === id);
    const newTodos = todos.filter(t => t.id !== id);
    setTodos(newTodos);

    // Remover da API se disponível
    if (apiAvailable && todo) {
      try {
        const dbId = todo._id || todo.id;
        if (dbId) {
          await todosAPI.delete(dbId);
        }
      } catch (error) {
        console.error('Erro ao remover tarefa da API:', error);
      }
    }
  };

  const completeTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    const newIsCompleted = !todo.isCompleted;
    
    // Atualizar localmente primeiro
    const newTodos = todos.map(t => 
      t.id === id ? { ...t, isCompleted: newIsCompleted } : t
    );
    setTodos(newTodos);

    // Se foi marcada como completa, enviar WhatsApp e sincronizar com API
    if (apiAvailable && todo) {
      try {
        const dbId = todo._id || todo.id;
        if (dbId) {
          await todosAPI.update(dbId, { isCompleted: newIsCompleted }, whatsappPhone || null);
        }
      } catch (error) {
        console.error('Erro ao atualizar tarefa na API:', error);
      }
    }

    // Enviar WhatsApp se foi completada e tem número configurado
    if (newIsCompleted && whatsappPhone && whatsappEnabled) {
      sendWhatsAppReminder(todo);
    }
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
    .filter((todo) => {
      if (!todo || !todo.text) return false;
      return filter === "All" 
        ? true 
        : filter === "completed" 
        ? todo.isCompleted 
        : !todo.isCompleted;
    })
    .filter((todo) => {
      if (!todo || !todo.text) return false;
      return todo.text.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const textA = a.text || '';
      const textB = b.text || '';
      return sort === "Asc" 
        ? textA.localeCompare(textB) 
        : textB.localeCompare(textA);
    });

  // Calcular estatísticas
  const stats = {
    total: todos.filter(todo => todo && todo.text).length,
    completed: todos.filter(todo => todo && todo.isCompleted).length,
    pending: todos.filter(todo => todo && !todo.isCompleted).length,
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      } catch (error) {
        console.error('Erro ao solicitar permissão de notificações:', error);
      }
    }
  };

  const [whatsappEnabled, setWhatsappEnabled] = useState(
    localStorage.getItem('whatsappReminders') === 'true'
  );

  const toggleWhatsApp = () => {
    const newValue = !whatsappEnabled;
    setWhatsappEnabled(newValue);
    localStorage.setItem('whatsappReminders', newValue.toString());
  };

  return (
    <div className='app'>
      <h1>
        <TbList className="icon-title" />
        Lista de Tarefas
      </h1>
      
      {/* Aviso de permissão de notificações */}
      {typeof Notification !== 'undefined' && (
        <>
          {notificationPermission === 'default' && (
            <div className="notification-banner">
              <p>
                <TbBell className="icon-inline" />
                Para receber lembretes, permita notificações do navegador.
              </p>
              <button onClick={requestNotificationPermission} className="notification-btn">
                Permitir Notificações
              </button>
            </div>
          )}
          
          {notificationPermission === 'denied' && (
            <div className="notification-banner denied">
              <p>
                <TbAlertTriangle className="icon-inline" />
                As notificações estão bloqueadas. Ative-as nas configurações do navegador para receber lembretes.
              </p>
            </div>
          )}
        </>
      )}

      {/* Configuração WhatsApp */}
      <div className="whatsapp-config">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={whatsappEnabled}
            onChange={toggleWhatsApp}
          />
          <span>
            <TbBrandWhatsapp className="icon-inline whatsapp-icon" />
            Enviar lembretes via WhatsApp
          </span>
        </label>
        {whatsappEnabled && (
          <div className="whatsapp-phone-input" style={{ marginTop: '10px' }}>
            <input
              type="tel"
              placeholder="Número WhatsApp (ex: 5511999999999)"
              value={whatsappPhone}
              onChange={(e) => {
                const phone = e.target.value.replace(/\D/g, '');
                setWhatsappPhone(phone);
                localStorage.setItem('whatsappPhone', phone);
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #10b981',
                fontSize: '0.9rem'
              }}
            />
            <small style={{ display: 'block', marginTop: '5px', color: '#065f46', fontSize: '0.85rem' }}>
              Formato: código do país + DDD + número (sem espaços)
            </small>
          </div>
        )}
        {apiAvailable && (
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#10b981' }}>
            ✅ API conectada - Tarefas serão salvas no banco de dados
          </div>
        )}
        {!apiAvailable && (
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#f59e0b' }}>
            ⚠️ API desconectada - Usando apenas armazenamento local
          </div>
        )}
      </div>
      
      {/* Estatísticas */}
      {todos.length > 0 && (
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">
              <TbListCheck className="icon-inline" />
              Total
            </span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">
              <TbListCheck className="icon-inline" />
              Completas
            </span>
            <span className="stat-value completed">{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">
              <TbBell className="icon-inline" />
              Pendentes
            </span>
            <span className="stat-value pending">{stats.pending}</span>
          </div>
        </div>
      )}
      
      {/* Botão para limpar todos */}
      {todos.length > 0 && (
        <button 
          onClick={clearAllTodos}
          className="clear-all-btn"
          aria-label="Limpar todas as tarefas"
        >
          <TbTrash className="icon-inline" />
          Limpar Todas as Tarefas
        </button>
      )}
      
      {/* Botão para alternar calendário */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          className="calendar-toggle-btn"
          aria-label="Alternar visualização de calendário"
        >
          {showCalendar ? (
            <>
              <TbListCheck className="icon-inline" />
              Ver Lista
            </>
          ) : (
            <>
              <TbCalendar className="icon-inline" />
              Ver Calendário
            </>
          )}
        </button>
      </div>

      {showCalendar ? (
        <Calendar 
          todos={todos} 
          addTodo={addTodo}
          editTodo={editTodo}
          removeTodo={removeTodo}
          completeTodo={completeTodo}
        />
      ) : (
        <>
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
              editTodo={editTodo}
            />
          ))
        ) : (
          <p className="empty-message">
            {search || filter !== "All" 
              ? "🔍 Nenhuma tarefa encontrada com os filtros atuais." 
              : "✨ Nenhuma tarefa cadastrada. Adicione uma nova tarefa acima!"}
          </p>
          )}
          </div>
          
          <TodoForm addTodo={addTodo} />
        </>
      )}
    </div>
  );
}

export default App;
