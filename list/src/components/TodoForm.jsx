import { useState, useEffect } from "react"
import { TbPlus, TbCalendar, TbBell, TbBriefcase, TbUser, TbSchool, TbSparkles } from 'react-icons/tb';

const TodoForm = ({addTodo, initialDueDate = null}) => {
    const [value, setValue] = useState("")
    const [category, setCategory] = useState("")
    const [dueDate, setDueDate] = useState(initialDueDate || "")
    const [reminderEnabled, setReminderEnabled] = useState(false)
    const [reminderTime, setReminderTime] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (initialDueDate) {
            setDueDate(initialDueDate);
        }
    }, [initialDueDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        
        if(!value.trim()) {
            setError("Por favor, digite uma tarefa.");
            return;
        }
        
        if(!category) {
            setError("Por favor, selecione uma categoria.");
            return;
        }

        // Validar data de lembrete se habilitado
        if(reminderEnabled && reminderTime) {
            const reminder = new Date(reminderTime);
            const now = new Date();
            if(reminder < now) {
                setError("O horário do lembrete deve ser no futuro.");
                return;
            }
        }
        
        // Adicionar Todo
        let finalDueDate = null;
        if (dueDate) {
          try {
            const date = new Date(dueDate);
            if (!isNaN(date.getTime())) {
              finalDueDate = date.toISOString();
            }
          } catch (e) {
            setError("Data de vencimento inválida.");
            return;
          }
        }
        
        let finalReminderTime = null;
        if (reminderEnabled && reminderTime) {
          try {
            const date = new Date(reminderTime);
            if (!isNaN(date.getTime())) {
              finalReminderTime = date.toISOString();
            }
          } catch (e) {
            setError("Horário do lembrete inválido.");
            return;
          }
        }
        
        addTodo(value.trim(), category, finalDueDate, reminderEnabled, finalReminderTime);
        setCategory("")
        setValue("")
        // Manter initialDueDate se existir, caso contrário limpar
        setDueDate(initialDueDate || "")
        setReminderEnabled(false)
        setReminderTime("")
        setError("")
    }

    // Calcular data mínima para o lembrete (hoje)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    }
    
  return (
    <div className='todo-form'>
        <h2>
          <TbPlus className="icon" />
          Criar Nova Tarefa
        </h2>
        <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <input 
                type="text" 
                placeholder='Digite o título da tarefa'
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setError("");
                }}
                aria-label="Título da tarefa"
                maxLength={200}
            />
            <select  
                value={category} 
                onChange={(e) => {
                    setCategory(e.target.value);
                    setError("");
                }}
                aria-label="Categoria da tarefa"
            >
                <option value="" disabled>Selecione a categoria</option>
                <option value="Trabalho"><TbBriefcase /> Trabalho</option>
                <option value="Pessoal"><TbUser /> Pessoal</option>
                <option value="Estudos"><TbSchool /> Estudos</option>
            </select>
            
            <div className="form-group">
                <label htmlFor="dueDate">
                  <TbCalendar className="icon-inline" />
                  Data de Vencimento (Opcional):
                </label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => {
                        setDueDate(e.target.value);
                        setError("");
                    }}
                    aria-label="Data de vencimento"
                />
            </div>

            <div className="form-group checkbox-group">
                <label htmlFor="reminderEnabled" className="checkbox-label">
                    <input
                        type="checkbox"
                        id="reminderEnabled"
                        checked={reminderEnabled}
                        onChange={(e) => {
                            setReminderEnabled(e.target.checked);
                            if (!e.target.checked) setReminderTime("");
                        }}
                        aria-label="Ativar lembrete"
                    />
                    <span>
                      <TbBell className="icon-inline" />
                      Ativar Lembrete
                    </span>
                </label>
            </div>

            {reminderEnabled && (
                <div className="form-group">
                    <label htmlFor="reminderTime">
                      <TbBell className="icon-inline" />
                      Horário do Lembrete:
                    </label>
                    <input
                        type="datetime-local"
                        id="reminderTime"
                        value={reminderTime}
                        onChange={(e) => {
                            setReminderTime(e.target.value);
                            setError("");
                        }}
                        min={getMinDateTime()}
                        aria-label="Horário do lembrete"
                    />
                    <small className="form-hint">
                        Você receberá notificações até completar a tarefa
                    </small>
                </div>
            )}
            
            <button type="submit">
              <TbSparkles className="icon-inline" />
              Criar Tarefa
            </button>
        </form>
    </div>
  )
}

export default TodoForm