import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { servicos } from "../../servicos";
import { logout, setUserLogged } from "../../redux/slices/authSlice";

const PERFIL_ROUTES: Record<number, string> = {
  1: "/",
  2: "/",
  3: "/",
  4: "/ues",
  5: "/dres",
};

function getRouteByPerfil(tipoPerfil: number | null) {
  return tipoPerfil ? PERFIL_ROUTES[tipoPerfil] ?? "/sem-acesso" : "/sem-acesso";
}

function isTokenValid(exp: string | null) {
  if (!exp) return false;
  return new Date(exp) > new Date();
}

export default function Autenticacao() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get("codigo");
  const isExecuting = useRef(false);

  useEffect(() => {
    if (isExecuting.current) return;
    isExecuting.current = true;

    const storedToken = localStorage.getItem("authToken");
    const exp = localStorage.getItem("authExpiresAt");
    const perfil = Number(localStorage.getItem("tipoPerfil"));

    async function autenticar() {
      if (storedToken && isTokenValid(exp)) {
        dispatch(
          setUserLogged({
            token: storedToken,
            dataHoraExpiracao: exp!,
            tipoPerfil: perfil.toString(),
          })
        );

        navigate(getRouteByPerfil(perfil));
        return;
      }

      if (storedToken) dispatch(logout());

      if (!codigo) {
        navigate("/sem-acesso");
        return;
      }

      try {
        const resposta = await servicos.post("/api/v1/autenticacao/validar", {
          codigo,
        });

        const { token, dataHoraExpiracao, tipoPerfil } = resposta;

        dispatch(setUserLogged({ token, dataHoraExpiracao, tipoPerfil }));

        navigate(getRouteByPerfil(tipoPerfil));
      } catch (err) {
        console.error("Erro ao autenticar:", err);
        navigate("/sem-acesso");
      }
    }

    autenticar();
  }, [codigo, dispatch, navigate]);

  return <div>Autenticando...</div>;
}
