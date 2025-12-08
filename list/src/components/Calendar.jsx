import { useState } from 'react';
import { TbCalendar, TbChevronLeft, TbChevronRight, TbPlus } from 'react-icons/tb';
import TodoForm from './TodoForm';
import Todo from './Todo';

const Calendar = ({ todos = [], addTodo, editTodo, removeTodo, completeTodo }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState('');
  
  // Verificar se as funções necessárias existem
  if (!addTodo || !editTodo || !removeTodo || !completeTodo) {
    return <div className="error-message">Erro: Funções necessárias não fornecidas ao calendário.</div>;
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date) => {
    if (!date || isNaN(date.getTime())) {
      date = new Date();
    }
    
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Dias do mês anterior (para preencher a primeira semana)
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
        if (!isNaN(dayDate.getTime())) {
          days.push({
            date: dayDate,
            isCurrentMonth: false,
          });
        }
      }

      // Dias do mês atual
      for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(year, month, i);
        if (!isNaN(dayDate.getTime())) {
          days.push({
            date: dayDate,
            isCurrentMonth: true,
          });
        }
      }

      // Dias do próximo mês (para completar a última semana)
      const remainingDays = 42 - days.length; // 6 semanas * 7 dias
      for (let i = 1; i <= remainingDays; i++) {
        const dayDate = new Date(year, month + 1, i);
        if (!isNaN(dayDate.getTime())) {
          days.push({
            date: dayDate,
            isCurrentMonth: false,
          });
        }
      }

      return days;
    } catch (e) {
      console.error('Erro ao gerar dias do mês:', e);
      return [];
    }
  };

  const getTodosForDate = (date) => {
    if (!date || !Array.isArray(todos)) return [];
    try {
      const dateStr = date.toISOString().split('T')[0];
      return todos.filter(todo => {
        if (!todo || !todo.dueDate) return false;
        try {
          const todoDate = new Date(todo.dueDate);
          if (isNaN(todoDate.getTime())) return false;
          return todoDate.toISOString().split('T')[0] === dateStr;
        } catch (e) {
          return false;
        }
      });
    } catch (e) {
      return [];
    }
  };

  const handleDateClick = (date) => {
    if (!date) return;
    try {
      const dateStr = date.toISOString().split('T')[0];
      setSelectedDate(date);
      setFormDate(dateStr);
      setShowForm(false); // Não mostrar formulário automaticamente, apenas selecionar a data
    } catch (e) {
      console.error('Erro ao processar data:', e);
    }
  };

  const handleAddTodoWithDate = (text, category, dueDate, reminderEnabled, reminderTime) => {
    try {
      // Se formDate está definido, usar ele; caso contrário, usar o dueDate do formulário
      let finalDueDate = null;
      if (formDate) {
        const date = new Date(formDate + 'T00:00:00');
        if (!isNaN(date.getTime())) {
          finalDueDate = date.toISOString();
        }
      } else if (dueDate) {
        const date = new Date(dueDate);
        if (!isNaN(date.getTime())) {
          finalDueDate = date.toISOString();
        }
      }
      
      addTodo(text, category, finalDueDate, reminderEnabled, reminderTime);
      setShowForm(false);
      setFormDate('');
    } catch (e) {
      console.error('Erro ao adicionar tarefa:', e);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateTodos = selectedDate ? getTodosForDate(selectedDate) : [];

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav-btn">
          <TbChevronLeft />
        </button>
        <h2 className="calendar-month-year">
          <TbCalendar className="icon-inline" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="calendar-nav-btn">
          <TbChevronRight />
        </button>
      </div>

      <button onClick={goToToday} className="calendar-today-btn">
        <TbCalendar className="icon-inline" />
        Hoje
      </button>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        
        {days.map((day, index) => {
          const dayTodos = getTodosForDate(day.date);
          const hasTodos = dayTodos.length > 0;
          const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
          const isTodayDate = isToday(day.date);
          const isPastDate = isPast(day.date);

          return (
            <div
              key={index}
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${isPastDate ? 'past' : ''} ${isSelected ? 'selected' : ''} ${hasTodos ? 'has-todos' : ''}`}
              onClick={() => handleDateClick(day.date)}
            >
              <div className="calendar-day-number">{day.date.getDate()}</div>
              {hasTodos && (
                <div className="calendar-day-todos">
                  <span className="todo-count">{dayTodos.length}</span>
                  <div className="todo-dots">
                    {dayTodos.slice(0, 3).map((todo) => {
                      let isOverdue = false;
                      if (!todo.isCompleted && todo.dueDate) {
                        try {
                          const dueDate = new Date(todo.dueDate);
                          if (!isNaN(dueDate.getTime())) {
                            isOverdue = dueDate < new Date();
                          }
                        } catch (e) {
                          // Ignorar erro
                        }
                      }
                      const bgColor = todo.category === 'Trabalho' ? '#667eea' : todo.category === 'Pessoal' ? '#10b981' : '#f59e0b';
                      return (
                        <span
                          key={todo.id}
                          className={`todo-dot ${todo.isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                          style={{ backgroundColor: bgColor }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="calendar-selected-date">
          <h3>
            <TbCalendar className="icon-inline" />
            Tarefas para {selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          
          {showForm ? (
            <div className="calendar-form-wrapper">
              <TodoForm addTodo={handleAddTodoWithDate} initialDueDate={formDate} />
              <button 
                onClick={() => {
                  setShowForm(false);
                  setFormDate('');
                }}
                className="cancel"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowForm(true)}
              className="add-todo-date-btn"
            >
              <TbPlus className="icon-inline" />
              Adicionar Tarefa nesta Data
            </button>
          )}

          <div className="calendar-todos-list">
            {selectedDateTodos.length > 0 ? (
              selectedDateTodos.map(todo => (
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
                Nenhuma tarefa para esta data. Clique em "Adicionar Tarefa" para criar uma.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

