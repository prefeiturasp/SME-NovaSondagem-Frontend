import { createMockStore } from "./mockStore";

describe("mockStore", () => {
  describe("createMockStore", () => {
    it("deve criar uma store com configuração inicial", () => {
      const store = createMockStore();

      expect(store).toBeDefined();
      expect(store.getState).toBeDefined();
      expect(store.dispatch).toBeDefined();
      expect(store.subscribe).toBeDefined();
    });

    it("deve retornar estado inicial com usuario não logado", () => {
      const store = createMockStore();
      const state = store.getState();

      expect(state).toEqual({
        usuario: {
          logado: false,
        },
      });
    });

    it("deve ter a propriedade usuario no estado", () => {
      const store = createMockStore();
      const state = store.getState();

      expect(state).toHaveProperty("usuario");
    });

    it("deve ter usuario.logado como false no estado inicial", () => {
      const store = createMockStore();
      const state = store.getState();

      expect(state.usuario).toHaveProperty("logado");
      expect(state.usuario.logado).toBe(false);
    });

    it("deve permitir obter estado múltiplas vezes", () => {
      const store = createMockStore();
      const state1 = store.getState();
      const state2 = store.getState();

      expect(state1).toEqual(state2);
      expect(state1.usuario.logado).toBe(false);
      expect(state2.usuario.logado).toBe(false);
    });

    it("deve criar múltiplas stores independentes", () => {
      const store1 = createMockStore();
      const store2 = createMockStore();

      expect(store1).toBeDefined();
      expect(store2).toBeDefined();
      expect(store1).not.toBe(store2);
    });

    it("deve manter estado consistente após dispatch de ação qualquer", () => {
      const store = createMockStore();
      const estadoInicial = store.getState();

      store.dispatch({ type: "QUALQUER_ACAO" });
      const estadoDepois = store.getState();

      expect(estadoDepois).toEqual(estadoInicial);
    });

    it("deve permitir subscribe para mudanças de estado", () => {
      const store = createMockStore();
      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      expect(unsubscribe).toBeDefined();
      expect(typeof unsubscribe).toBe("function");

      store.dispatch({ type: "TESTE" });

      expect(listener).toHaveBeenCalled();
    });

    it("deve permitir unsubscribe de listener", () => {
      const store = createMockStore();
      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);
      unsubscribe();

      store.dispatch({ type: "TESTE" });

      expect(listener).toHaveBeenCalledTimes(0);
    });

    it("deve ter todos os métodos da store do Redux Toolkit", () => {
      const store = createMockStore();

      expect(typeof store.getState).toBe("function");
      expect(typeof store.dispatch).toBe("function");
      expect(typeof store.subscribe).toBe("function");
      expect(typeof store.replaceReducer).toBe("function");
    });

    it("deve retornar tipo correto para usuario.logado", () => {
      const store = createMockStore();
      const state = store.getState();

      expect(typeof state.usuario.logado).toBe("boolean");
    });

    it("deve manter estado imutável", () => {
      const store = createMockStore();
      const state1 = store.getState();
      const state2 = store.getState();

      expect(state1).toEqual(state2);
      expect(state1.usuario).toEqual(state2.usuario);
    });
  });

  describe("mockReducer behavior", () => {
    it("deve manter estado após dispatch de múltiplas ações", () => {
      const store = createMockStore();

      store.dispatch({ type: "ACAO_1" });
      store.dispatch({ type: "ACAO_2" });
      store.dispatch({ type: "ACAO_3" });

      const state = store.getState();
      expect(state.usuario.logado).toBe(false);
    });

    it("deve ignorar ações desconhecidas", () => {
      const store = createMockStore();
      const estadoInicial = store.getState();

      store.dispatch({ type: "ACAO_DESCONHECIDA", payload: { teste: true } });

      const estadoFinal = store.getState();
      expect(estadoFinal).toEqual(estadoInicial);
    });

    it("deve manter estrutura do estado após várias operações", () => {
      const store = createMockStore();

      for (let i = 0; i < 10; i++) {
        store.dispatch({ type: `ACAO_${i}` });
      }

      const state = store.getState();
      expect(state).toHaveProperty("usuario");
      expect(state.usuario).toHaveProperty("logado");
      expect(state.usuario.logado).toBe(false);
    });
  });

  describe("Store integration", () => {
    it("deve funcionar com múltiplos subscribers", () => {
      const store = createMockStore();
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);
      store.subscribe(listener3);

      store.dispatch({ type: "TESTE" });

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      expect(listener3).toHaveBeenCalled();
    });

    it("deve notificar subscribers na ordem correta", () => {
      const store = createMockStore();
      const callOrder: number[] = [];

      store.subscribe(() => callOrder.push(1));
      store.subscribe(() => callOrder.push(2));
      store.subscribe(() => callOrder.push(3));

      store.dispatch({ type: "TESTE" });

      expect(callOrder).toEqual([1, 2, 3]);
    });

    it("deve criar store que pode ser utilizada em testes de componentes", () => {
      const store = createMockStore();

      expect(store.getState()).toBeDefined();
      expect(store.dispatch).toBeDefined();

      const estadoParaComponente = store.getState();
      expect(estadoParaComponente.usuario.logado).toBe(false);
    });
  });
});
