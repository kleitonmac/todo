import express from 'express';
import Todo from '../models/Todo.js';
import { sendWhatsAppMessage } from '../services/whatsappService.js';

const router = express.Router();

// GET - Buscar todas as tarefas
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default';
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar tarefa por ID
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova tarefa
router.post('/', async (req, res) => {
  try {
    // Normalizar dados recebidos
    const todoData = {
      text: req.body.text || req.body.text?.trim(),
      category: req.body.category,
      isCompleted: req.body.isCompleted || false,
      dueDate: req.body.dueDate || null,
      reminderEnabled: req.body.reminderEnabled || false,
      reminderTime: req.body.reminderTime || null,
      userId: req.body.userId || 'default',
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
    };

    // Validar campos obrigatórios
    if (!todoData.text || !todoData.category) {
      return res.status(400).json({ error: 'Texto e categoria são obrigatórios' });
    }

    const todo = new Todo(todoData);
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT - Atualizar tarefa
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Se a tarefa foi marcada como completa, enviar WhatsApp
    if (req.body.isCompleted === true && !todo.whatsappSent && req.body.whatsappPhone) {
      const message = `✅ *Tarefa Concluída!*\n\n` +
        `*Tarefa:* ${todo.text}\n` +
        `*Categoria:* ${todo.category}\n` +
        `Parabéns por completar esta tarefa! 🎉\n\n` +
        `Continue assim! 💪`;
      
      try {
        const whatsappResult = await sendWhatsAppMessage(req.body.whatsappPhone, message);
        
        if (whatsappResult.success) {
          todo.whatsappSent = true;
          todo.whatsappPhone = req.body.whatsappPhone;
          await todo.save();
        }
      } catch (whatsappError) {
        console.error('Erro ao enviar WhatsApp:', whatsappError);
        // Não falhar a atualização se WhatsApp falhar
      }
    }

    res.json(todo);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Deletar tarefa
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa deletada com sucesso', todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Sincronizar múltiplas tarefas
router.post('/sync', async (req, res) => {
  try {
    const { todos, userId = 'default' } = req.body;
    
    if (!Array.isArray(todos)) {
      return res.status(400).json({ error: 'todos deve ser um array' });
    }

    const results = [];

    for (const todoData of todos) {
      try {
        // Normalizar dados
        const normalizedData = {
          text: todoData.text?.trim(),
          category: todoData.category,
          isCompleted: todoData.isCompleted || false,
          dueDate: todoData.dueDate ? new Date(todoData.dueDate) : null,
          reminderEnabled: todoData.reminderEnabled || false,
          reminderTime: todoData.reminderTime ? new Date(todoData.reminderTime) : null,
          lastReminderSent: todoData.lastReminderSent ? new Date(todoData.lastReminderSent) : null,
          userId: userId,
          createdAt: todoData.createdAt ? new Date(todoData.createdAt) : new Date(),
          updatedAt: new Date(),
        };

        // Validar
        if (!normalizedData.text || !normalizedData.category) {
          console.warn('Tarefa inválida ignorada:', todoData);
          continue;
        }

        if (todoData._id) {
          // Atualizar tarefa existente
          const todo = await Todo.findByIdAndUpdate(
            todoData._id,
            normalizedData,
            { new: true, upsert: false }
          );
          if (todo) {
            results.push(todo);
          } else {
            // Se não encontrou, criar nova
            const newTodo = new Todo(normalizedData);
            await newTodo.save();
            results.push(newTodo);
          }
        } else {
          // Criar nova tarefa
          const todo = new Todo(normalizedData);
          await todo.save();
          results.push(todo);
        }
      } catch (itemError) {
        console.error('Erro ao processar item:', itemError);
        // Continuar com próximo item
      }
    }

    res.json({ 
      message: 'Sincronização concluída', 
      todos: results,
      count: results.length 
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST - Enviar lembrete via WhatsApp
router.post('/:id/reminder', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Número de telefone é obrigatório' });
    }

    const message = `⏰ *Lembrete de Tarefa*\n\n` +
      `*Tarefa:* ${todo.text}\n` +
      `*Categoria:* ${todo.category}\n` +
      `${todo.dueDate ? `*Prazo:* ${new Date(todo.dueDate).toLocaleDateString('pt-BR')}\n` : ''}` +
      `${todo.isCompleted ? '✅ *Status:* Completa' : '⏳ *Status:* Pendente'}\n\n` +
      `Acesse o site para completar esta tarefa!`;

    const result = await sendWhatsAppMessage(phoneNumber, message);
    
    if (result.success) {
      todo.lastReminderSent = new Date();
      await todo.save();
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

