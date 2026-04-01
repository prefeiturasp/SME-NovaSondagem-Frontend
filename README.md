# SME Nova Sondagem Frontend

Microfrontend React/TypeScript da Nova Sondagem, integrado ao SGP.

## 1. Objetivo e contexto

Este projeto entrega a interface de Sondagem e Relatórios da SME no formato de microfrontend, exposto via Module Federation para ser consumido por um shell/aplicação host (SGP).

Principais responsabilidades:

- Renderizar telas de Sondagem.
- Renderizar telas de Relatório (incluindo consolidado).
- Consumir APIs da Nova Sondagem com autenticação por token.
- Trabalhar com variáveis de ambiente em runtime (browser) e em desenvolvimento local.

## 2. Stack técnica

- Frontend: React 18, React Router DOM 6, TypeScript.
- Build/dev server: Vite 4.
- Microfrontend: `@originjs/vite-plugin-federation` (Module Federation).
- Estado global: Redux Toolkit (store simplificada/mocada para execução isolada).
- UI: Ant Design 5 + styled-components.
- HTTP: Axios.
- Testes: Jest + ts-jest + Testing Library (React, DOM, user-event).
- Qualidade: ESLint (flat config) + TypeScript strict.
- Container: Docker multi-stage (Node + Nginx).

## 3. Requisitos

### 3.1 Execução local

- Node.js 16.
- npm ou yarn.

### 3.2 Execução em container

- Docker.

Observação: o `Dockerfile` usa `node:16-slim` no estágio de build e Nginx no estágio de runtime.

## 4. Estrutura de pastas (visão técnica)

Pontos mais relevantes:

- `src/main.tsx`: bootstrap React.
- `src/App.tsx`: providers globais (Redux, AntD, Router).
- `src/AppRoutes.tsx`: roteamento principal (`/`, `/relatorio`, `/relatorio/consolidado`, `/sem-acesso`).
- `src/config.ts`: resolução de URLs de API via `window.__ENV__` e fallback.
- `src/core/servico/api.tsx`: cliente Axios com interceptors e fluxo de autenticação/token.
- `src/paginas/`: páginas principais do microfrontend.
- `src/componentes/`: componentes de domínio.
- `src/services/`: serviços por domínio (ano letivo, bimestre, turma, DRE, UE, etc.).
- `public/env.js`: variáveis injetadas no browser.
- `scripts/generate-env.js`: gera `public/env.js` a partir de `.env`.
- `vite.config.ts`: configuração Vite + Federation + aliases.
- `jest.config.cjs`: configuração de testes e cobertura.
- `configuracoes/default.conf`: configuração Nginx para SPA e assets.
- `startup.sh`: entrypoint do container com `envsubst` em `env.js`.

## 5. Arquitetura de execução

## 5.1 Bootstrap da aplicação

1. `src/main.tsx` monta o `App` em `#root`.
2. `src/App.tsx` aplica:
   - `Provider` do Redux.
   - `ConfigProvider` do Ant Design.
   - `BrowserRouter`.
3. `src/AppRoutes.tsx` resolve rotas e tela inicial.

## 5.2 Store/estado

Atualmente a aplicação usa uma store simplificada (`src/mocks/mockStore.ts`) para execução isolada, com estado inicial de usuário (`usuario.logado`).

## 5.3 Integração HTTP e autenticação

O cliente principal (`src/core/servico/api.tsx`) funciona assim:

- Define `baseURL` por `getApiUrl()` (`src/config.ts`).
- Interceptor de request:
  - tenta recuperar token local (`localStorage`, chave `nova_sondagem_token`);
  - se não houver token, usa header `X-Token-Principal` para autenticar em `POST /Autenticacao`;
  - injeta `Authorization: Bearer <token>`;
  - remove `X-Token-Principal` da requisição final.
- Interceptor de response:
  - em `401`, limpa token local.
- Expõe `CancelarRequisicoes()` para cancelar requests pendentes.

## 5.4 Rotas internas

Rotas definidas em `src/AppRoutes.tsx`:

- `/` -> página Home (protegida por lógica de `PrivateRoute`).
- `/relatorio` -> página de relatório.
- `/relatorio/consolidado` -> relatório consolidado.
- `/sem-acesso` -> fallback de acesso.

## 6. Module Federation

Configuração em `vite.config.ts`:

- Nome do remoto: `smeNovaSondagem`.
- Entry remoto: `remoteEntry.js`.
- Módulos expostos:
  - `./Home` -> `./src/paginas/home/home.tsx`
  - `./Relatorio` -> `./src/paginas/relatorio/relatorio.tsx`
  - `./relatorio/consolidado` -> `./src/paginas/relatorio/relatorioConsolidado.tsx`
- Dependências compartilhadas (com versão requerida):
  - `react`, `react-dom`, `react-redux`, `antd`.

Configuração adicional importante:

- `server.port` e `preview.port`: `5173`.
- CORS habilitado para desenvolvimento/preview.
- Middleware customizado força headers corretos para `remoteEntry.js`.

## 7. Variáveis de ambiente

Variáveis utilizadas:

- `VITE_NOVA_SONDAGEM_API`
- `VITE_NOVA_SONDAGEM_VERSAO`
- `VITE_SGP_API`

### 7.1 Prioridade de resolução

Em runtime, `src/config.ts` busca primeiro em:

1. `window.__ENV__` (arquivo `public/env.js`, útil para container/runtime).
2. `process.env` (fallback local).
3. fallback padrão: `http://localhost:5173`.

### 7.2 Geração local de `env.js`

O script `generate-env`:

- lê `.env`;
- faz parse manual (compatível com CRLF/LF);
- gera `public/env.js`.

## 8. Scripts disponíveis

Scripts do `package.json`:

- `npm run dev`: gera `env.js` e sobe Vite em modo desenvolvimento.
- `npm run build`: type-check/build TypeScript e build Vite.
- `npm run preview`: serve build localmente.
- `npm run mf:dev`: fluxo de microfrontend local (build watch + preview na porta 5173).
- `npm run lint`: executa ESLint.
- `npm run test`: executa testes Jest.
- `npm run test:watch`: testes em watch mode.
- `npm run test:coverage`: testes com cobertura.
- `npm run test:coverage:file`: cobertura com `--collectCoverageFrom`.
- `npm run test:jenkins`: type-check sem emissão (`tsc --noEmit`).

## 9. Setup local (passo a passo)

1. Instalar dependências:

```bash
npm install
```

2. Criar/ajustar arquivo `.env` na raiz com as variáveis necessárias.

3. Executar em modo de microfrontend local:

```bash
npm run mf:dev
```

Alternativas:

- Desenvolvimento padrão:

```bash
npm run dev
```

- Build + preview:

```bash
npm run build
npm run preview
```

## 10. Testes e cobertura

Configuração principal (`jest.config.cjs`):

- Ambiente: `jsdom`.
- Preset: `ts-jest`.
- Roots: `src`.
- Suporte a aliases `@/` e `~/`.
- Mapeamento de estáticos/CSS para mocks.
- Setup de testes em `src/setupTests.ts`.

Cobertura:

- Coleta em `src/**/*.{ts,tsx}` com exclusões de arquivos de bootstrap/config e mocks.
- Threshold global atual está configurado em 0 (branches/functions/lines/statements).

Saídas comuns de cobertura:

- `coverage/lcov.info`
- `coverage/lcov-report/index.html`

## 11. Lint e TypeScript

### 11.1 ESLint

Arquivo: `eslint.config.js` (flat config):

- Base: `@eslint/js` recomendado.
- TypeScript: `typescript-eslint` recomendado.
- React hooks: `eslint-plugin-react-hooks`.
- React refresh: `eslint-plugin-react-refresh`.
- Ignora `dist`.

### 11.2 TypeScript

- `tsconfig.app.json`: app React (`strict: true`, aliases `@/*` e `~/*`, `noEmit: true`).
- `tsconfig.node.json`: config para arquivos Node (ex.: `vite.config.ts`).
- `tsconfig.test.json`: ajustes para Jest/Node/CommonJS em testes.

## 12. Build e deploy com Docker

Pipeline do `Dockerfile`:

1. Stage build (`node:16-slim`):
   - copia `package.json` e `yarn.lock`;
   - executa `yarn install`;
   - copia código;
   - executa `yarn build`.
2. Stage runtime (`nginx:1.27.3-alpine`):
   - copia `dist` para `/usr/share/nginx/html`;
   - aplica conf Nginx custom (`configuracoes/default.conf`);
   - executa `startup.sh`.

### 12.1 Runtime env no container

No startup:

- `startup.sh` aplica `envsubst` em `/usr/share/nginx/html/env.js`;
- substitui placeholders pelas variáveis do ambiente do container;
- inicia Nginx em foreground.

### 12.2 Nginx

`configuracoes/default.conf` contempla:

- fallback SPA com `try_files $uri /index.html`;
- headers de cache e CORS para assets;
- tratamento de `OPTIONS` para assets.

## 13. Integração com sistema host (SGP)

Este microfrontend é consumido pelo SGP via Module Federation. Em ambiente integrado, o acesso funcional ocorre no fluxo do SGP (menu Diário de Classe -> Sondagem), respeitando autenticação e contexto fornecidos pelo host.

## 14. Troubleshooting rápido

### 15.1 `remoteEntry.js` não carrega

- Verifique se a aplicação está rodando na porta `5173`.
- Confirme CORS habilitado no ambiente local/reverso.

### 15.2 API retornando 401

- Verifique validade do token em `localStorage` (`nova_sondagem_token`).
- Garanta envio de `X-Token-Principal` quando necessário para autenticação inicial.

### 15.3 Variáveis de ambiente não aplicadas

- Em local: validar `.env` e execução de `npm run generate-env`.
- Em container: validar variáveis do ambiente e conteúdo final de `env.js` após startup.

## 15. Licença

Ver arquivo `LICENSE`.
