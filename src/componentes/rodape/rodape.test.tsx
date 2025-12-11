import { render } from '@testing-library/react';
import Rodape from './rodape';

describe('Rodape', () => {
  it('deve renderizar o texto do rodapé corretamente', () => {
    const { getByText } = render(<Rodape />);

    const textoRodape = getByText('ESTE É O RODAPÉ');
    expect(textoRodape).toBeInTheDocument();
  });

  it('deve renderizar com a classe CSS correta', () => {
    const { container } = render(<Rodape />);

    const rodape = container.querySelector('.cabecalho');
    expect(rodape).toBeInTheDocument();
  });

  it('deve renderizar o componente Header do antd', () => {
    const { container } = render(<Rodape />);

    const header = container.querySelector('.ant-layout-header');
    expect(header).toBeInTheDocument();
  });
});
