describe('Teste simples', () => {
  it('Teste de soma', () => {
    expect(1 + 1).toBe(2);
  });

  it('testa se é igual', () => {
    expect('hello').toBe('hello');
  });

  it('testa valures verdadeiros', () => {
    expect(true).toBeTruthy();
  });
});
