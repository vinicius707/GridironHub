# Guia de Deploy - GridironHub

Este documento descreve o processo completo de deploy do GridironHub na Vercel.

## Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Configuração Inicial](#configuração-inicial)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Processo de Deploy](#processo-de-deploy)
- [SSG/ISR Configuration](#ssgisr-configuration)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

## Visão Geral

O GridironHub é uma aplicação Next.js que utiliza SSG (Static Site Generation) e ISR (Incremental Static Regeneration) para otimização de performance. O deploy é realizado na Vercel, que oferece suporte nativo ao Next.js.

## Pré-requisitos

1. **Conta Vercel:** [vercel.com/signup](https://vercel.com/signup)
2. **Repositório Git:** GitHub, GitLab ou Bitbucket
3. **API Key balldontlie:** Obtida em [balldontlie.io](https://www.balldontlie.io/)

## Configuração Inicial

### 1. Preparar Repositório

Certifique-se de que o repositório está pronto:

```bash
# Verificar build local
npm run build

# Verificar testes
npm test

# Verificar lint
npm run lint
```

### 2. Conectar Repositório na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Selecione "Import Git Repository"
3. Escolha seu repositório GridironHub
4. Configure:
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Root Directory:** `./` (raiz do projeto)
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `.next` (padrão)

## Variáveis de Ambiente

### Configurar na Vercel

1. No painel da Vercel, vá em **Settings → Environment Variables**
2. Adicione a variável:

```
Key: BALLDONTLIE_API_KEY
Value: sua_chave_aqui
Environment: Production, Preview, Development
```

### Importante

- ✅ A variável `BALLDONTLIE_API_KEY` é **obrigatória**
- ✅ Configure para todos os ambientes (Production, Preview, Development)
- ✅ Nunca commite a API key no código
- ✅ Use o painel da Vercel para configuração segura

## Processo de Deploy

### Deploy Automático

O deploy automático é acionado por:

1. **Push para `main`:** Deploy de produção
2. **Pull Requests:** Preview deployments automáticos
3. **Push para `develop`:** Preview deployment (se configurado)

### Deploy Manual

Para fazer deploy manual:

1. Instale a Vercel CLI:

```bash
npm i -g vercel
```

2. Faça login:

```bash
vercel login
```

3. Deploy:

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## SSG/ISR Configuration

### Estratégia de Geração

O projeto utiliza uma estratégia híbrida:

#### Páginas Estáticas (SSG)

- Home (`/`)
- Layouts com locale

#### ISR On-Demand

- **Páginas de lista:**
  - `/teams` - Revalidação: 1 hora
  - `/players` - Revalidação: 30 minutos

- **Páginas de detalhes:**
  - `/teams/[id]` - Revalidação: 1 hora
  - `/players/[id]` - Revalidação: 30 minutos

### Benefícios

- ⚡ **Performance:** Páginas pré-renderizadas servidas instantaneamente
- 🔄 **Atualização:** ISR mantém conteúdo atualizado sem rebuild completo
- 📊 **SEO:** Melhor indexação com conteúdo estático
- 💰 **Economia:** Reduz requisições à API

### Configuração

As configurações de `revalidate` estão definidas em cada página:

```typescript
// Exemplo: src/app/[locale]/teams/page.tsx
export const revalidate = 3600 // 1 hora em segundos
```

## Monitoramento

### Build Logs

Monitore os logs de build na Vercel:

1. Acesse o projeto na Vercel
2. Vá em **Deployments**
3. Clique no deployment para ver logs

### Métricas

A Vercel fornece métricas de:

- **Performance:** Core Web Vitals
- **Traffic:** Requisições e bandwidth
- **Errors:** Erros de runtime
- **Functions:** Execuções serverless

### Rate Limit da API

⚠️ **Importante:** A API balldontlie tem limite de **5 requisições/minuto** no plano gratuito.

**Como monitorar:**
- Verifique logs da API por erros 429 (Rate Limited)
- ISR reduz requisições, mas monitore durante build
- Considere upgrade do plano se necessário

## Troubleshooting

### Erro: "BALLDONTLIE_API_KEY não configurada"

**Causa:** Variável de ambiente não configurada na Vercel.

**Solução:**
1. Verifique se `BALLDONTLIE_API_KEY` está configurada
2. Confirme que está marcada para todos os ambientes
3. Faça redeploy após adicionar a variável

### Erro: Build falha por Rate Limit

**Causa:** Muitas requisições durante o build.

**Solução:**
- O projeto já está configurado para evitar isso (ISR on-demand)
- Se ocorrer, aguarde alguns minutos e tente novamente
- Considere aumentar o intervalo entre builds

### Erro: TypeScript errors no build

**Causa:** Erros de tipo no código.

**Solução:**
```bash
# Verificar localmente
npm run lint
npm run build

# Corrigir erros antes de fazer push
```

### Erro: Páginas não atualizando

**Causa:** Cache do ISR ainda válido.

**Solução:**
- Aguarde o período de revalidação configurado
- Ou faça redeploy para forçar atualização

### Deploy lento

**Causa:** Build demorado ou muitas dependências.

**Solução:**
- Verifique o tamanho do projeto
- Considere otimizar dependências
- Use cache da Vercel (automático para npm/yarn)

## Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [SSG/ISR Guide](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

---

**Última atualização:** 2024
