import React, { useState, useEffect } from "react";
import { TbCalendar, TbBell, TbEdit, TbTrash, TbCheck, TbRotateClockwise, TbAlertTriangle, TbBriefcase, TbUser, TbSchool } from 'react-icons/tb';

const Todo = ({todo, removeTodo, completeTodo, editTodo}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text || '');
  const [editCategory, setEditCategory] = useState(todo.category || '');
  const [editDueDate, setEditDueDate] = useState('');
  const [editReminderEnabled, setEditReminderEnabled] = useState(false);
  const [editReminderTime, setEditReminderTime] = useState('');

  // Atualizar estados quando todo mudar
  useEffect(() => {
    if (todo.dueDate) {
      try {
        const date = new Date(todo.dueDate);
        if (!isNaN(date.getTime())) {
          setEditDueDate(date.toISOString().split('T')[0]);
        } else {
          setEditDueDate('');
        }
      } catch (e) {
        setEditDueDate('');
      }
    } else {
      setEditDueDate('');
    }
    
    if (todo.reminderTime) {
      try {
        const date = new Date(todo.reminderTime);
        if (!isNaN(date.getTime())) {
          setEditReminderTime(date.toISOString().slice(0, 16));
        } else {
          setEditReminderTime('');
        }
      } catch (e) {
        setEditReminderTime('');
      }
    } else {
      setEditReminderTime('');
    }
    
    setEditReminderEnabled(todo.reminderEnabled || false);
  }, [todo]);

  const handleSave = () => {
    if (editText.trim() && editCategory) {
      const finalDueDate = editDueDate ? new Date(editDueDate).toISOString() : null;
      const finalReminderTime = editReminderEnabled && editReminderTime ? new Date(editReminderTime).toISOString() : null;
      editTodo(todo.id, editText.trim(), editCategory, finalDueDate, editReminderEnabled, finalReminderTime);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text || '');
    setEditCategory(todo.category || '');
    if (todo.dueDate) {
      try {
        const date = new Date(todo.dueDate);
        setEditDueDate(!isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '');
      } catch (e) {
        setEditDueDate('');
      }
    } else {
      setEditDueDate('');
    }
    setEditReminderEnabled(todo.reminderEnabled || false);
    if (todo.reminderTime) {
      try {
        const date = new Date(todo.reminderTime);
        setEditReminderTime(!isNaN(date.getTime()) ? date.toISOString().slice(0, 16) : '');
      } catch (e) {
        setEditReminderTime('');
      }
    } else {
      setEditReminderTime('');
    }
    setIsEditing(false);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };
  
  const isOverdue = () => {
    if (!todo.dueDate || todo.isCompleted) return false;
    try {
      const dueDate = new Date(todo.dueDate);
      const now = new Date();
      return !isNaN(dueDate.getTime()) && dueDate < now;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={`todo ${todo.isCompleted ? 'completed' : ''}`}>
      <div className="content">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              className="edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Edite a tarefa"
              autoFocus
            />
            <select
              className="edit-select"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option value="Trabalho">Trabalho</option>
              <option value="Pessoal">Pessoal</option>
              <option value="Estudos">Estudos</option>
            </select>
            <div className="form-group">
              <label>
                <TbCalendar className="icon-inline" />
                Data de Vencimento:
              </label>
              <input
                type="date"
                className="edit-input"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={editReminderEnabled}
                  onChange={(e) => {
                    setEditReminderEnabled(e.target.checked);
                    if (!e.target.checked) setEditReminderTime("");
                  }}
                />
                <span>
                  <TbBell className="icon-inline" />
                  Ativar Lembrete
                </span>
              </label>
            </div>
            {editReminderEnabled && (
              <div className="form-group">
                <label>
                  <TbBell className="icon-inline" />
                  Horário do Lembrete:
                </label>
                <input
                  type="datetime-local"
                  className="edit-input"
                  value={editReminderTime}
                  onChange={(e) => setEditReminderTime(e.target.value)}
                  min={getMinDateTime()}
                />
              </div>
            )}
            <div className="actions">
              <button className="save" onClick={handleSave}>
                Salvar
              </button>
              <button className="cancel" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="todo-text">{todo.text || 'Tarefa sem título'}</p>
            <div className="todo-meta">
              {todo.category && (
                <span className="category">
                  {todo.category === 'Trabalho' && <TbBriefcase className="icon-inline" />}
                  {todo.category === 'Pessoal' && <TbUser className="icon-inline" />}
                  {todo.category === 'Estudos' && <TbSchool className="icon-inline" />}
                  {todo.category}
                </span>
              )}
              {todo.dueDate && (
                <span className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
                  <TbCalendar className="icon-inline" />
                  {formatDate(todo.dueDate)}
                  {isOverdue() && (
                    <>
                      <TbAlertTriangle className="icon-inline" />
                      Atrasada
                    </>
                  )}
                </span>
              )}
              {todo.reminderEnabled && (
                <span className="reminder-badge">
                  <TbBell className="icon-inline" />
                  Lembrete ativo
                </span>
              )}
              {todo.createdAt && (
                <span className="date">Criado em: {formatDate(todo.createdAt)}</span>
              )}
            </div>
          </>
        )}
      </div>
      {!isEditing && (
        <div className="actions">
          <button 
            className={`complete ${todo.isCompleted ? 'is-completed' : ''}`}
            onClick={() => completeTodo(todo.id)}
            aria-label={todo.isCompleted ? 'Marcar como incompleta' : 'Marcar como completa'}
          >
            {todo.isCompleted ? (
              <>
                <TbRotateClockwise className="icon-inline" />
                Desfazer
              </>
            ) : (
              <>
                <TbCheck className="icon-inline" />
                Completar
              </>
            )}
          </button>
          <button 
            className="edit" 
            onClick={() => setIsEditing(true)}
            aria-label="Editar tarefa"
          >
            <TbEdit className="icon-inline" />
            Editar
          </button>
          <button 
            className="remove" 
            onClick={() => removeTodo(todo.id)}
            aria-label="Remover tarefa"
          >
            <TbTrash className="icon-inline" />
            Remover
          </button>
        </div>
      )}
    </div>
  );
};

export default Todo;
