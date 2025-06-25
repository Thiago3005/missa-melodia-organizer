# Música Litúrgica - Sistema de Gestão Musical

## Overview
Sistema completo de gestão musical para a paróquia de Boa Viagem, focado na organização de missas, músicos e repertório litúrgico. Desenvolvido especificamente para uso do coordenador do coral.

## User Preferences
- Interface otimizada para administrador único (coordenador do coral)
- Fluxos simples, rápidos e sem distrações
- Layout moderno com sidebar azul escuro (#0F172A)
- Dados sempre sincronizados em tempo real
- Sem necessidade de login multiusuário no momento

## Project Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Replit built-in) + Drizzle ORM
- **State Management**: React hooks + API integration
- **UI Components**: Shadcn/ui components

## Recent Changes
- **2025-01-24**: Migrated from Lovable to Replit
  - Replaced Supabase with PostgreSQL + Drizzle
  - Created comprehensive API routes
  - Implemented secure client-server architecture
- **2025-01-24**: Enhanced UI requirements received and implemented
  - Sidebar navigation structure with dark theme (#0F172A)
  - Dashboard with comprehensive metrics cards
  - Improved sections for Missas, Músicos, Músicas, Sugestões, Relatórios
  - Real-time data synchronization focus
  - Modern layout with collapsible sidebar
  - Complete UI overhaul following user specifications

## Features
- Dashboard com métricas principais e visão geral
- Gestão completa de missas e escalas musicais
- Cadastro e controle detalhado de músicos
- Biblioteca integrada de músicas litúrgicas com busca no YouTube
- Sistema avançado de sugestões com workflow de aprovação
- Relatórios e análises históricas com exportação PDF
- Interface otimizada para coordenador único
- Sidebar com navegação intuitiva e tema escuro
- Cards informativos com estatísticas em tempo real

## Technical Notes
- Uses modern React patterns with TypeScript
- Database schema designed for church music management
- API endpoints for all CRUD operations
- Components are modular and reusable