import { mapIdNameAndSort } from "./mapToOptions";

describe("mapIdNameAndSort", () => {
  it("retorna array vazio quando entrada não é array", () => {
    expect(mapIdNameAndSort(null as any)).toEqual([]);
    expect(mapIdNameAndSort({} as any)).toEqual([]);
  });

  it("mapeia id/nome e ordena ignorando acentos e caixa", () => {
    const resultado = mapIdNameAndSort([
      { id: 3, nome: "zebra" },
      { id: 1, nome: "Árvore" },
      { id: 2, nome: "banana" },
    ]);

    expect(resultado).toEqual([
      { value: 1, label: "Árvore" },
      { value: 2, label: "banana" },
      { value: 3, label: "zebra" },
    ]);
  });

  it("permite customizar a chave do label", () => {
    const resultado = mapIdNameAndSort(
      [
        { id: 2, descricao: "Beta" },
        { id: 1, descricao: "Alfa" },
      ],
      "descricao",
    );

    expect(resultado).toEqual([
      { value: 1, label: "Alfa" },
      { value: 2, label: "Beta" },
    ]);
  });
});
