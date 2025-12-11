import { render } from '@testing-library/react';
import Conteudo from './conteudo';

describe('Conteudo', () => {
  it('deve renderizar o texto do conteúdo corretamente', () => {
    const { getByText } = render(<Conteudo />);

    const textoConteudo = getByText('ESTE É O CONTEUDO');
    expect(textoConteudo).toBeInTheDocument();
  });

  it('deve renderizar com a classe CSS correta', () => {
    const { container } = render(<Conteudo />);

    const conteudo = container.querySelector('.conteudo');
    expect(conteudo).toBeInTheDocument();
  });

  it('deve renderizar o componente Header do antd', () => {
    const { container } = render(<Conteudo />);

    const header = container.querySelector('.ant-layout-header');
    expect(header).toBeInTheDocument();
  });
});
