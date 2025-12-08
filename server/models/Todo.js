import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Trabalho', 'Pessoal', 'Estudos']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  reminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: Date,
    default: null
  },
  lastReminderSent: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    default: 'default' // Para permitir múltiplos usuários no futuro
  },
  whatsappSent: {
    type: Boolean,
    default: false
  },
  whatsappPhone: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'todos' // Nome da coleção no MongoDB
});

// Índices para melhor performance
todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ isCompleted: 1 });

// Atualizar updatedAt antes de salvar
todoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.createdAt) {
    this.createdAt = Date.now();
  }
  next();
});

// Método para normalizar dados
todoSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

export default mongoose.model('Todo', todoSchema);

