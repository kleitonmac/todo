# 📋 Lista de Tarefas - To-Do List App

Uma aplicação moderna e profissional de gerenciamento de tarefas desenvolvida com React e Vite. Organize suas tarefas pessoais, de trabalho e estudos de forma eficiente e intuitiva.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Funcionalidades

### 🎯 Principais Recursos

- **✅ Gerenciamento Completo de Tarefas**
  - Criar novas tarefas com título e categoria
  - Editar tarefas existentes (texto, categoria, data e lembretes)
  - Marcar tarefas como completas/incompletas
  - Remover tarefas individualmente
  - Limpar todas as tarefas de uma vez

- **📅 Calendário Visual**
  - Visualização mensal de todas as tarefas
  - Navegação entre meses
  - Indicadores visuais de tarefas por data
  - Criação rápida de tarefas em datas específicas
  - Visualização de tarefas do dia selecionado
  - Destaque para tarefas completas e atrasadas

- **🔔 Sistema de Lembretes (Inspirado no Todoist)**
  - Ativar lembretes para tarefas importantes
  - Notificações do navegador até a tarefa ser concluída
  - Lembretes diários para tarefas atrasadas
  - Configuração de horário específico para lembretes
  - Lembretes automáticos baseados na data de vencimento
  - Solicitação automática de permissão de notificações

- **📆 Datas e Prazos**
  - Definir data de vencimento para tarefas
  - Visualização de tarefas atrasadas com destaque
  - Data de criação registrada para cada tarefa
  - Exibição formatada em português brasileiro

- **🔍 Busca e Filtros**
  - Busca em tempo real por texto
  - Filtro por status (Todas, Completas, Incompletas)
  - Ordenação alfabética (A-Z / Z-A)

- **📊 Estatísticas**
  - Contador de tarefas totais
  - Contador de tarefas completas
  - Contador de tarefas pendentes

- **💾 Persistência de Dados**
  - Armazenamento local no navegador (localStorage)
  - Dados salvos automaticamente
  - Recuperação automática ao recarregar a página
  - Compatibilidade com versões antigas dos dados

- **🎨 Interface Moderna**
  - Design responsivo e adaptável
  - Animações suaves e transições
  - Tema moderno com gradientes
  - Interface intuitiva e acessível
  - Alternância entre visualização de lista e calendário

- **♿ Acessibilidade**
  - Atributos ARIA para leitores de tela
  - Navegação por teclado
  - Feedback visual claro

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório ou baixe os arquivos
2. Navegue até a pasta do projeto:
   ```bash
   cd list
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra seu navegador em `http://localhost:5173`

### Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`. Para visualizar:

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
list/
├── public/              # Arquivos públicos
│   └── icons.jpg       # Ícone da aplicação
├── src/
│   ├── components/     # Componentes React
│   │   ├── Todo.jsx       # Componente de tarefa individual
│   │   ├── TodoForm.jsx   # Formulário de criação
│   │   ├── Filter.jsx     # Componente de filtros
│   │   └── Search.jsx     # Componente de busca
│   ├── App.jsx         # Componente principal
│   ├── App.css         # Estilos da aplicação
│   └── main.jsx        # Ponto de entrada
├── index.html          # HTML principal
├── package.json        # Dependências e scripts
└── vite.config.js      # Configuração do Vite
```

## 🛠️ Tecnologias Utilizadas

- **React 19.2.0** - Biblioteca JavaScript para construção de interfaces
- **Vite 7.2.2** - Build tool e servidor de desenvolvimento
- **CSS3** - Estilização moderna com animações e gradientes
- **LocalStorage API** - Armazenamento local de dados

## 🎨 Categorias de Tarefas

- 💼 **Trabalho** - Tarefas relacionadas ao trabalho
- 👤 **Pessoal** - Tarefas pessoais
- 📚 **Estudos** - Tarefas relacionadas a estudos

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- 📱 Dispositivos móveis (smartphones)
- 📱 Tablets
- 💻 Desktops
- 🖥️ Telas grandes

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter ESLint

## 🔔 Como Usar Lembretes

1. **Ativar Lembretes:**
   - Ao criar ou editar uma tarefa, marque a opção "Ativar Lembrete"
   - Defina um horário específico ou use a data de vencimento
   - Permita notificações quando solicitado pelo navegador

2. **Funcionamento:**
   - Lembretes são enviados diariamente até a tarefa ser concluída
   - Tarefas atrasadas recebem lembretes especiais
   - As notificações aparecem mesmo com a aplicação fechada (se permitido)

3. **Permissões:**
   - O navegador solicitará permissão na primeira vez
   - Se negado, você pode ativar nas configurações do navegador

## 📅 Como Usar o Calendário

1. **Visualizar Calendário:**
   - Clique no botão "📅 Ver Calendário" no topo da página
   - Navegue entre meses usando as setas
   - Clique em "📅 Hoje" para voltar ao mês atual

2. **Criar Tarefas:**
   - Clique em qualquer data do calendário
   - Clique em "➕ Adicionar Tarefa nesta Data"
   - A data será preenchida automaticamente

3. **Visualizar Tarefas:**
   - Datas com tarefas mostram indicadores coloridos
   - Clique em uma data para ver todas as tarefas daquele dia
   - Tarefas completas aparecem com opacidade reduzida
   - Tarefas atrasadas têm destaque especial

## 📝 Melhorias Futuras

Possíveis melhorias que podem ser implementadas:

- [ ] Autenticação de usuários
- [ ] Sincronização em nuvem
- [ ] Categorias personalizadas
- [ ] Prioridades de tarefas
- [ ] Modo escuro/claro
- [ ] Exportação de dados (JSON, CSV)
- [ ] Compartilhamento de listas
- [ ] Lembretes recorrentes
- [ ] Integração com calendários externos

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para portfólio

## 🙏 Agradecimentos

- React Team pela incrível biblioteca
- Vite Team pela ferramenta de build
- Comunidade open source

---

⭐ Se você gostou deste projeto, considere dar uma estrela no repositório!
