import React from "react";
import { Button, Card } from "antd";

const SemAcesso: React.FC = () => {
  return (
    <div style={styles.container}>
      <Card variant="borderless" style={styles.card}>
        <div style={styles.imageContainer}>
          <img
            src="/acesso_negado.svg"
            alt="Acesso Negado"
            style={styles.image}
          />
        </div>
        <h2 style={styles.title}>
          Desculpe, você não está autorizado a acessar esta página
        </h2>
        <p style={styles.subtitle}>
          Para acessar, primeiro você precisa realizar o seu login com usuário e
          senha.
        </p>

        <Button
          type="primary"
          size="large"
          style={styles.button}
          href="https://serap.sme.prefeitura.sp.gov.br/"
        >
          Fazer login
        </Button>
      </Card>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: "20px",
  },
  image: {
    width: "300px",
    height: "auto",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  button: {
    width: "150px",
  },
};

export default SemAcesso;
