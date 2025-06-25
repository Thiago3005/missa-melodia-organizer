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
- **2025-01-24**: Advanced features implementation
  - Complete musician availability system with absence tracking
  - Intelligent sheet music search with external integrations
  - Enhanced music library with text-based sheet music storage
  - Database schema extensions for availability and music assignments
  - Improved UI for managing musician schedules and music resources

## Features
- Dashboard com métricas principais e visão geral
- Gestão completa de missas e escalas musicais
- Cadastro e controle detalhado de músicos
- Sistema completo de disponibilidade dos músicos
  - Registro de ausências (férias, doença, compromisso pessoal, outro)
  - Períodos de indisponibilidade com datas
  - Verificação automática de disponibilidade por data
  - Integração com seleção de músicos para missas
- Biblioteca integrada de músicas litúrgicas
  - Busca inteligente de partituras
  - Integração com Cifras e Partituras - Arquidiocese de Goiânia
  - Download de áudio via CNV MP3
  - Campo de partitura em texto para cada música
  - Busca no YouTube integrada
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