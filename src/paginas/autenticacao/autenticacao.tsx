import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { servicos } from "../../servicos";
import { logout, setUserLogged } from "../../redux/slices/authSlice";

const Autenticacao: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get("codigo");

  const isExecuting = useRef(false);

  useEffect(() => {
    const verificarToken = async () => {
      if (isExecuting.current) return;
      isExecuting.current = true;

      const storedToken = localStorage.getItem("authToken");
      const dataHoraExpiracao = localStorage.getItem("authExpiresAt");
      const tipoPerfil = localStorage.getItem("tipoPerfil");
      const tipoPerfilNum = tipoPerfil ? Number(tipoPerfil) : null;

      if (storedToken && dataHoraExpiracao) {
        const expiraEm = new Date(dataHoraExpiracao);
        if (expiraEm > new Date()) {
          dispatch(
            setUserLogged({
              token: storedToken,
              dataHoraExpiracao: dataHoraExpiracao,
              tipoPerfil: tipoPerfil,
            })
          );

          if (
            tipoPerfilNum === 1 ||
            tipoPerfilNum === 2 ||
            tipoPerfilNum === 3
          ) {
            navigate("/");
          } else if (tipoPerfilNum === 4 || tipoPerfilNum === 5) {
            navigate("/ues");
          }

          return;
        } else {
          dispatch(logout());
        }
      }

      if (codigo) {
        try {
          const resposta = await servicos.post("/api/v1/autenticacao/validar", {
            codigo,
          });

          const { token, dataHoraExpiracao, tipoPerfil } = resposta;

          dispatch(setUserLogged({ token, dataHoraExpiracao, tipoPerfil }));

          if (tipoPerfil === 1 || tipoPerfil === 2 || tipoPerfil === 3) {
            navigate("/");
          } else if (tipoPerfil === 4) {
            navigate("/ues");
          } else if (tipoPerfil === 5) {
            navigate("/dres");
          }
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          navigate("/sem-acesso");
        }
      } else {
        navigate("/sem-acesso");
      }
    };

    verificarToken();
  }, [codigo, dispatch, navigate]);

  return <div>Autenticando...</div>;
};

export default Autenticacao;
