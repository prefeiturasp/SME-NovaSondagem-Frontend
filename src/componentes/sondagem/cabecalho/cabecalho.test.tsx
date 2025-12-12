import { render } from '@testing-library/react';
import Cabecalho from './cabecalho';

describe('Cabecalho', () => {
  it('deve renderizar o texto do cabeçalho corretamente', () => {
    const { getByText } = render(<Cabecalho />);

    const textoHeader = getByText('ESTE É O CABECALHO');
    expect(textoHeader).toBeInTheDocument();
  });

  it('deve renderizar com a classe CSS correta', () => {
    const { container } = render(<Cabecalho />);

    const header = container.querySelector('.cabecalho');
    expect(header).toBeInTheDocument();
  });

  it('deve renderizar o componente Header do antd', () => {
    const { container } = render(<Cabecalho />);

    const header = container.querySelector('.ant-layout-header');
    expect(header).toBeInTheDocument();
  });
});
