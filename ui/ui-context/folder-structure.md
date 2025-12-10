# UI Folder Structure

```
ui/src/
├── components/
│   ├── ui/              # shadcn components (button, card, input, table)
│   ├── layout/          # App structure (Header, Sidebar, InputBox, AppLayout)
│   ├── leads/           # Lead-related components
│   └── agent/           # Agent-related components
├── hooks/               # Custom React hooks
├── lib/                 # Services and core logic (context-manager, message-service)
├── types/               # TypeScript type definitions
├── pages/               # Route views (Dashboard, Leads, Settings)
├── assets/              # Static files
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Rules

**components/ui/** - shadcn/ui only, don't modify
**components/layout/** - App structure, reusable across all pages
**components/{domain}/** - Domain-specific components (leads, agent, deals, etc.)
**hooks/** - All custom React hooks
**lib/** - Services, managers, utilities
**types/** - All TypeScript interfaces/types
**pages/** - One file per route

