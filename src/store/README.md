# Redux Store - Guia de Uso

## Estrutura

```
src/
├── store/
│   ├── index.ts          # Configuração da store
│   ├── hooks.ts          # Hooks tipados do Redux
│   └── README.md         # Este arquivo
├── slices/
│   ├── exemploSlice.ts   # Slice de exemplo
│   └── *.test.ts         # Testes dos slices
└── utils/
    └── test-utils.tsx    # Utilitários para testar com Redux
```

## Como usar no componente

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { buscarDados, limparDados } from '../slices/exemploSlice';

function MeuComponente() {
  const dispatch = useAppDispatch();
  const { dados, loading, error } = useAppSelector((state) => state.exemplo);

  const handleBuscar = () => {
    dispatch(buscarDados('/endpoint'));
  };

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      <button onClick={handleBuscar}>Buscar</button>
    </div>
  );
}
```

## Como criar um novo slice

1. Crie um arquivo em `src/slices/nomeSlice.ts`
2. Defina a interface do estado
3. Crie o slice com `createSlice`
4. Adicione o reducer na store (`src/store/index.ts`)

Exemplo:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MeuState {
  valor: number;
}

const initialState: MeuState = {
  valor: 0,
};

const meuSlice = createSlice({
  name: 'meuSlice',
  initialState,
  reducers: {
    incrementar: (state) => {
      state.valor += 1;
    },
    definirValor: (state, action: PayloadAction<number>) => {
      state.valor = action.payload;
    },
  },
});

export const { incrementar, definirValor } = meuSlice.actions;
export default meuSlice.reducer;
```

## Como criar actions assíncronas (thunks)

Use `createAsyncThunk` para chamadas de API:

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { servicos } from '../servicos';

export const buscarUsuario = createAsyncThunk(
  'usuario/buscar',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await servicos.get(`/usuarios/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);
```

## Como testar componentes com Redux

Use o utilitário `renderWithProviders`:

```typescript
import { renderWithProviders } from '../utils/test-utils';
import MeuComponente from './MeuComponente';

test('renderiza o componente', () => {
  const { getByText } = renderWithProviders(<MeuComponente />);
  expect(getByText('Buscar')).toBeInTheDocument();
});
```

## DevTools

O Redux DevTools está habilitado automaticamente em desenvolvimento. Instale a extensão do navegador:
- Chrome: https://chrome.google.com/webstore/detail/redux-devtools/
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/
