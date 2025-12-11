import { render } from '@testing-library/react';
import SemAcesso from './SemAcesso';

describe('SemAcesso', () => {
  it('deve renderizar o título corretamente', () => {
    const { getByText } = render(<SemAcesso />);

    const titulo = getByText('Desculpe, você não está autorizado a acessar esta página');
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar o subtítulo corretamente', () => {
    const { getByText } = render(<SemAcesso />);

    const subtitulo = getByText(/Para acessar, primeiro você precisa realizar o seu login/i);
    expect(subtitulo).toBeInTheDocument();
  });

  it('deve renderizar a imagem de acesso negado', () => {
    const { container } = render(<SemAcesso />);

    const imagem = container.querySelector('img[alt="Acesso Negado"]');
    expect(imagem).toBeInTheDocument();
    expect(imagem).toHaveAttribute('src', '/acesso_negado.svg');
  });

  it('deve renderizar o botão de fazer login', () => {
    const { getByText } = render(<SemAcesso />);

    const botao = getByText('Fazer login');
    expect(botao).toBeInTheDocument();
  });

  it('deve ter o link correto no botão de login', () => {
    const { getByText } = render(<SemAcesso />);

    const botao = getByText('Fazer login');
    const link = botao.closest('a');
    expect(link).toHaveAttribute('href', 'https://serap.sme.prefeitura.sp.gov.br/');
  });

  it('deve renderizar o Card do antd', () => {
    const { container } = render(<SemAcesso />);

    const card = container.querySelector('.ant-card');
    expect(card).toBeInTheDocument();
  });

  it('deve renderizar o botão com tipo primary', () => {
    const { container } = render(<SemAcesso />);

    const botao = container.querySelector('.ant-btn-primary');
    expect(botao).toBeInTheDocument();
  });
});
