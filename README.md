# Aquafeed

Monitoramento e registro de leituras para tanques de aquicultura.

## 🚀 Começar

### Pré-requisitos
- Node.js 16+
- pnpm (ou npm/yarn)

### Instalação

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
pnpm build
```

### Preview da Build

```bash
pnpm preview
```

## 📋 Funcionalidades

- ✅ Dashboard de monitoramento
- ✅ Registro de leituras
- ✅ Gerenciamento de tanques
- ✅ Perfil de usuário
- ✅ PWA com sincronização offline
- ✅ Animations suaves com Motion
- ✅ UI responsiva com TailwindCSS

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── components/        # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários e APIs
│   ├── types/             # Tipos TypeScript
│   └── App.tsx            # Componente raiz
├── pwa/                   # Service Worker
├── styles/                # Estilos CSS
├── imports/               # Imagens e assets
└── main.tsx               # Entry point
```

## 🛠️ Tech Stack

- **React 18.3** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **Motion** - Animations
- **Radix UI** - Component Primitives
- **React Router** - Navigation
- **Recharts** - Data Visualization

## 📦 Scripts

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Build para produção
- `pnpm preview` - Preview da build

## 📄 Licença

MIT
