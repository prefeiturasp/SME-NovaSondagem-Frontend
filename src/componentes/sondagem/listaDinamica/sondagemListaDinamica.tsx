import React, { useEffect, useState, useRef, useCallback } from "react";
import { Checkbox, ConfigProvider, Form, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import SelectColorido from "../selectColorido";
import type { DadosTabelaDinamica, Estudante } from "../../../core/dto/types";
import "./sondagemListaDinamica.css";
import { useSelector } from "react-redux";

const LogoPAP = () => (
  <svg
    height="24"
    viewBox="0 0 49 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: "0.5em" }}
  >
    <path
      d="M8.08008 11.9893V20.8506L1.56348 18.7656V16.9414C2.74697 17.2585 3.90914 16.3668 3.90918 15.1416V14.1191C3.90905 12.9986 3.20345 11.999 2.14746 11.624L1.56348 11.417V9.12207L8.08008 11.9893ZM15.3779 11.417L14.7939 11.624C13.738 11.999 13.0324 12.9986 13.0322 14.1191V15.1416C13.0323 16.3668 14.1944 17.2585 15.3779 16.9414V18.7656L8.86133 20.8506V11.9893L15.3779 9.12207V11.417ZM49 17.2021H20.3301V3.64941H49V17.2021ZM1.75781 12.9443C2.25457 12.9503 2.60645 13.3899 2.60645 13.8867V14.5957C2.60645 15.1715 2.13678 15.6651 1.56543 15.5938C0.754937 15.4925 0 15.1608 0 14.0742C0.000135869 13.1635 0.921591 12.9346 1.75781 12.9443ZM15.1836 12.9443C16.0198 12.9346 16.9413 13.1635 16.9414 14.0742C16.9414 15.1608 16.1865 15.4925 15.376 15.5938C14.8047 15.6651 14.335 15.1715 14.335 14.5957V13.8867C14.335 13.3899 14.6869 12.9504 15.1836 12.9443ZM3.90918 9.12207C3.70086 7.03743 5.38606 7.21115 6.25488 7.55859C8.86119 9.12238 10.6859 7.55868 11.7285 7.55859C12.5624 7.55859 13.1181 8.60068 13.292 9.12207C11.6239 9.33071 9.29544 10.4251 8.33984 10.9463C6.88029 9.90397 4.77787 9.29581 3.90918 9.12207ZM8.86133 0C10.8766 0 12.5107 1.63416 12.5107 3.64941C12.5105 5.66445 10.8764 7.29785 8.86133 7.29785C6.84641 7.29765 5.21315 5.66432 5.21289 3.64941C5.21289 1.63429 6.84625 0.000202088 8.86133 0Z"
      fill="#D06D12"
    />
    <path
      d="M27.2979 6.25537C27.9652 6.25537 28.5375 6.37668 29.0137 6.61865C29.4936 6.85671 29.8606 7.18649 30.1143 7.60791C30.3678 8.02925 30.4951 8.51101 30.4951 9.05322C30.4951 9.60347 30.3679 10.08 30.1143 10.4819C29.8606 10.8839 29.4936 11.194 29.0137 11.4126C28.5375 11.6312 27.9652 11.7407 27.2979 11.7407H25.7354V14.7788H23.9785V6.25537H27.2979ZM38 14.7788H36.126L35.5352 12.9819H32.4717L31.8818 14.7788H30.0146L33.1816 6.25537H34.8154L38 14.7788ZM42.1094 6.25537C42.7767 6.25538 43.3481 6.37673 43.8242 6.61865C44.3043 6.85672 44.6711 7.18641 44.9248 7.60791C45.1784 8.0293 45.3056 8.51091 45.3057 9.05322C45.3057 9.60352 45.1785 10.0799 44.9248 10.4819C44.6711 10.8839 44.3042 11.1941 43.8242 11.4126C43.3481 11.6311 42.7766 11.7407 42.1094 11.7407H40.5459V14.7788H38.79V6.25537H42.1094ZM32.9229 11.606H35.082L34.001 8.31885L32.9229 11.606ZM40.5459 10.3706H42.1094C42.445 10.3706 42.718 10.3158 42.9287 10.2065C43.1394 10.0934 43.294 9.93775 43.3916 9.73877C43.4892 9.53973 43.5381 9.31472 43.5381 9.06494C43.538 8.81142 43.4891 8.57537 43.3916 8.35693C43.294 8.13838 43.1395 7.96228 42.9287 7.82959C42.718 7.69705 42.4448 7.63135 42.1094 7.63135H40.5459V10.3706ZM25.7354 10.3706H27.2979C27.6335 10.3706 27.9074 10.3158 28.1182 10.2065C28.3286 10.0934 28.4826 9.93755 28.5801 9.73877C28.6776 9.53973 28.7266 9.31472 28.7266 9.06494C28.7265 8.81139 28.6776 8.57539 28.5801 8.35693C28.4825 8.13843 28.3289 7.96227 28.1182 7.82959C27.9074 7.6969 27.6335 7.63135 27.2979 7.63135H25.7354V10.3706Z"
      fill="white"
    />
  </svg>
);

const LogoAEE = () => (
  <svg
    height="24"
    viewBox="0 0 48 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: "0.5em" }}
  >
    <path
      d="M10.0576 0C13.4076 0.000174651 16.3247 1.84888 17.8477 4.58105C17.9165 4.57409 17.9869 4.57129 18.0576 4.57129C19.1935 4.57155 20.1143 5.49294 20.1143 6.62891C20.1141 7.44056 19.6428 8.14003 18.96 8.47461C18.967 8.62022 18.9717 8.7667 18.9717 8.91406C18.9717 11.3969 17.9551 13.6415 16.3174 15.2578C16.4066 15.4882 16.457 15.7381 16.457 16C16.457 17.136 15.5363 18.0574 14.4004 18.0576C13.7921 18.0576 13.2467 17.7917 12.8701 17.3721C11.9857 17.6661 11.0408 17.8281 10.0576 17.8281C8.94177 17.8281 7.87411 17.6215 6.88965 17.2471C6.51372 17.7384 5.9233 18.0576 5.25684 18.0576C4.12085 18.0575 3.2002 17.136 3.2002 16C3.2002 15.6137 3.30795 15.2531 3.49316 14.9443C2.03429 13.3571 1.14258 11.2398 1.14258 8.91406C1.14258 8.76672 1.14625 8.6202 1.15332 8.47461C0.470913 8.13987 0.000129043 7.44024 0 6.62891C0 5.49278 0.921489 4.57129 2.05762 4.57129C2.1278 4.5713 2.19725 4.57418 2.26562 4.58105C3.78858 1.84851 6.70728 0 10.0576 0ZM10.2461 10.79C10.1553 10.6574 9.95894 10.6574 9.86816 10.79L7.08594 14.8574L6.94238 14.8213C7.17635 15.1552 7.31445 15.5613 7.31445 16C7.31445 16.0613 7.30993 16.1217 7.30469 16.1816C8.16051 16.5059 9.08814 16.6855 10.0576 16.6855C10.8638 16.6855 11.6409 16.5619 12.3721 16.334C12.3543 16.2252 12.3428 16.1138 12.3428 16C12.3428 15.4715 12.5425 14.9894 12.8701 14.625L10.2461 10.79ZM48 14.8574H22.4004V3.42871H48V14.8574ZM16.9062 8.33301C15.8597 8.79438 13.7477 9.60927 11.8086 9.98828C11.6384 10.0218 11.5608 10.224 11.668 10.3604L14.498 13.9453C14.9156 13.9649 15.3001 14.1095 15.6162 14.3418C16.9841 12.941 17.8281 11.0266 17.8281 8.91406C17.8281 8.83267 17.8238 8.75169 17.8213 8.6709C17.4849 8.63245 17.1733 8.51369 16.9062 8.33301ZM3.2793 8.28223C2.99685 8.4913 2.65912 8.62802 2.29199 8.66992C2.28949 8.75102 2.28614 8.83236 2.28613 8.91406C2.28613 10.9387 3.06062 12.782 4.3291 14.165C4.60798 14.0237 4.92282 13.9424 5.25684 13.9424C5.36503 13.9424 5.47151 13.9517 5.5752 13.9678L8.21289 10.3887C8.31894 10.2442 8.22556 10.0367 8.04785 10.0127C6.91656 9.86024 4.8799 9.37227 3.2793 8.28223ZM10.0576 1.14258C7.18603 1.14258 4.67939 2.70129 3.33398 5.01758C3.80879 5.39441 4.11426 5.97564 4.11426 6.62891C4.11425 6.68051 4.11117 6.73158 4.10742 6.78223C6.00034 8.04003 10.6524 9.57172 16.0039 6.74902C16.0016 6.70939 16 6.66911 16 6.62891C16 5.97592 16.3048 5.39442 16.7793 5.01758C15.4339 2.70166 12.9288 1.14275 10.0576 1.14258ZM9.82812 2.05762C11.3429 2.05762 12.5712 3.28506 12.5713 4.7998C12.5713 6.31464 11.343 7.54297 9.82812 7.54297C8.31349 7.54273 7.08594 6.31449 7.08594 4.7998C7.08604 3.2852 8.31356 2.05786 9.82812 2.05762Z"
      fill="#086397"
    />
    <path
      d="M32.9072 13.0569H31.1924L30.6514 11.4124H27.8477L27.3086 13.0569H25.5996L28.498 5.25708H29.9922L32.9072 13.0569ZM38.8584 6.51587H35.2373V8.43384H38.3232V9.65552H35.2373V11.804H38.8643V13.0569H33.6299V5.25708H38.8584V6.51587ZM45.0303 5.25708V6.51587H41.4082V8.43384H44.4941V9.65552H41.4082V11.804H45.0352V13.0569H39.8018V5.25708H45.0303ZM28.2607 10.1536H30.2373L29.2471 7.14478L28.2607 10.1536Z"
      fill="white"
    />
  </svg>
);

const LogoAcessibilidade = () => (
  <svg
    height="24"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: "0.5em" }}
  >
    <ellipse
      cx="9.70606"
      cy="4.89747"
      rx="2.10255"
      ry="2.10255"
      fill="#45A7DF"
    />
    <ellipse
      cx="18.1159"
      cy="6.52532"
      rx="1.15301"
      ry="1.15301"
      fill="#45A7DF"
    />
    <ellipse
      cx="1.29559"
      cy="6.52532"
      rx="1.15301"
      ry="1.15301"
      fill="#45A7DF"
    />
    <ellipse
      cx="5.09344"
      cy="16.2919"
      rx="1.15301"
      ry="1.15301"
      fill="#45A7DF"
    />
    <ellipse
      cx="14.318"
      cy="16.2919"
      rx="1.15301"
      ry="1.15301"
      fill="#45A7DF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.84174 0.142286C6.00502 0.528219 4.51001 1.35751 3.18196 2.72701C2.55541 3.37318 1.8198 4.35911 1.8198 4.55275C1.8198 4.64084 2.21585 4.9252 2.33326 4.92143C2.36595 4.92035 2.49461 4.75111 2.61924 4.54527C3.13377 3.69535 4.13466 2.66824 5.05501 2.04573C5.887 1.48294 7.1949 0.965242 8.24877 0.781442C9.01497 0.647854 10.3289 0.647854 11.0951 0.781442C12.3177 0.994628 13.6315 1.55944 14.6201 2.29673C15.3058 2.80823 16.202 3.75439 16.6452 4.4348C16.8443 4.74053 17.0315 4.99072 17.0612 4.99072C17.1887 4.99072 17.5914 4.75643 17.5914 4.68229C17.5914 4.49667 16.7393 3.32344 16.1919 2.75559C14.8536 1.36708 13.3178 0.516896 11.4662 0.13959C10.5475 -0.0476479 8.73937 -0.0462998 7.84174 0.142286ZM8.80199 2.45775C8.10554 2.75081 7.53001 3.34568 7.29688 4.01341C7.12649 4.50146 7.14657 5.31774 7.34129 5.81873C7.53534 6.31783 8.11073 6.94795 8.58388 7.17947C9.89583 7.82132 11.4636 7.2807 12.1009 5.96654C12.276 5.60561 12.2966 5.49339 12.2984 4.88962C12.3003 4.29589 12.2789 4.16945 12.1188 3.82786C11.8791 3.3165 11.3524 2.76894 10.8694 2.52906C10.5408 2.36595 10.3817 2.33259 9.84042 2.31318C9.27905 2.29302 9.15105 2.31089 8.80199 2.45775ZM10.4176 3.08167C10.8923 3.24343 11.4136 3.78034 11.5535 4.25161C11.7733 4.99152 11.6112 5.69033 11.1048 6.18606C10.7095 6.573 10.2784 6.75155 9.73932 6.75155C8.31833 6.75155 7.412 5.26888 8.05924 4.0033C8.27094 3.58933 8.73209 3.17664 9.12409 3.0504C9.4555 2.94364 10.055 2.95813 10.4176 3.08167ZM0.870406 5.25735C0.324734 5.42268 0 5.8988 0 6.53337C0 7.0165 0.0984043 7.24465 0.433787 7.53905C0.832999 7.8896 1.43387 7.96805 1.87642 7.7275C2.01675 7.65127 2.13591 7.68436 2.96015 8.02844C4.90114 8.83879 6.79744 9.40758 8.21338 9.60412C8.59743 9.65744 8.92627 9.71574 8.94414 9.7336C8.962 9.75146 8.17766 10.9587 7.2011 12.4162L5.42558 15.0664L5.11648 15.0747C4.65257 15.0872 4.34866 15.2141 4.0858 15.5051C3.35336 16.3158 3.83878 17.6102 4.91401 17.7135C5.93121 17.8112 6.68212 16.8428 6.29935 15.9267C6.24233 15.7902 6.15148 15.6297 6.09742 15.57C6.0096 15.4729 6.18936 15.1787 7.78694 12.8041C8.77024 11.3426 9.59805 10.1387 9.62656 10.1289C9.655 10.1191 10.4894 11.3235 11.4808 12.8054L13.2834 15.4997L13.1386 15.7833C12.9433 16.1663 12.9753 16.7994 13.2071 17.1377C13.4935 17.5558 13.7746 17.6956 14.3282 17.6956C14.7723 17.6956 14.8385 17.6771 15.0745 17.487C15.4928 17.1502 15.6463 16.8269 15.6201 16.3387C15.5777 15.5531 15.057 15.0745 14.2551 15.084L13.8507 15.0889L12.0794 12.4295C11.1051 10.9668 10.3259 9.74108 10.3478 9.70569C10.3696 9.67031 10.4844 9.64133 10.6027 9.64133C11.484 9.64126 14.19 8.99341 16.1423 8.31516C17.2716 7.92283 17.4867 7.86897 17.9621 7.85967C18.5284 7.84862 18.7147 7.78466 19.0297 7.49315C19.3193 7.2251 19.4112 6.99385 19.4112 6.53337C19.4112 6.20877 19.3735 6.05025 19.2434 5.82816C18.9933 5.40145 18.6684 5.22763 18.1199 5.22709C17.7293 5.22668 17.6338 5.2529 17.3845 5.42882C16.8814 5.78381 16.6612 6.4568 16.8782 6.97612C16.9656 7.18527 16.9705 7.2501 16.9021 7.29452C16.7402 7.3998 14.3478 8.16014 13.4408 8.39463C11.5514 8.88314 10.0111 9.07207 8.82699 8.96065C7.30685 8.81763 5.42524 8.27998 3.17151 7.34467L2.50951 7.06994L2.57792 6.84712C2.6768 6.52495 2.58426 6.05382 2.36177 5.74661C2.03562 5.29644 1.41419 5.09256 0.870406 5.25735ZM1.734 6.10464C1.94423 6.31486 1.96701 6.37087 1.93155 6.58965C1.87757 6.92213 1.63189 7.15857 1.33142 7.16707C0.715655 7.18452 0.390584 6.48491 0.829157 6.08617C1.15119 5.79338 1.42841 5.79905 1.734 6.10464ZM18.653 6.1043C18.8316 6.30987 18.856 6.7072 18.7033 6.92517C18.5388 7.16013 18.1813 7.24525 17.9067 7.11497C17.4047 6.87677 17.3981 6.22737 17.8947 5.94173C18.1001 5.82365 18.4798 5.90507 18.653 6.1043ZM0.631337 8.46081C0.562657 8.6399 0.66005 10.1176 0.779146 10.703C1.11749 12.3661 1.88545 13.8866 3.03442 15.1681L3.36677 15.5388L3.61481 15.2913L3.86284 15.0438L3.43606 14.5499C2.06945 12.9684 1.348 11.0946 1.348 9.127C1.348 8.48858 1.33708 8.42812 1.22163 8.42812C1.15214 8.42812 1.00096 8.40925 0.885638 8.3862C0.724012 8.35385 0.665846 8.37097 0.631337 8.46081ZM17.9956 9.05158C17.9948 11.0957 17.2763 12.9642 15.8721 14.5743L15.5045 14.9958L15.7187 15.2167C15.8365 15.3383 15.9649 15.4359 16.0039 15.4335C16.043 15.4312 16.2569 15.2184 16.4793 14.9606C17.5455 13.7249 18.263 12.2483 18.5588 10.681C18.6818 10.0292 18.7709 8.77355 18.7111 8.53516C18.6713 8.3767 18.6365 8.36072 18.3316 8.36072H17.9958L17.9956 9.05158ZM5.47882 15.9104C5.95002 16.281 5.64901 17.0553 5.03378 17.0553C4.82949 17.0553 4.52606 16.8214 4.44133 16.5987C4.3585 16.3807 4.47524 16.013 4.67076 15.876C4.8766 15.7319 5.27339 15.7487 5.47882 15.9104ZM14.7883 15.9821C15.0325 16.2722 15.024 16.6001 14.7658 16.8583C14.62 17.0042 14.5049 17.0553 14.3225 17.0553C13.7619 17.0553 13.4649 16.3474 13.8599 15.9524C14.1256 15.6868 14.5513 15.7004 14.7883 15.9821ZM12.138 16.9627C11.2506 17.2536 10.5253 17.3435 9.36862 17.3059C8.51534 17.2782 8.20044 17.2384 7.64992 17.0888C6.58897 16.8006 6.64451 16.7996 6.54213 17.1098C6.4934 17.2573 6.47379 17.4106 6.49839 17.4505C6.5544 17.5412 7.32545 17.7734 7.99656 17.9018C8.69543 18.0355 10.6629 18.0319 11.3817 17.8956C11.8357 17.8094 12.9276 17.4954 12.99 17.4331C13.0388 17.3843 12.7827 16.7867 12.7154 16.7924C12.6726 16.7961 12.4128 16.8727 12.138 16.9627Z"
      fill="black"
    />
  </svg>
);

interface ListaSondagemEscritaProps {
  dados: DadosTabelaDinamica | null;
  podeSalvar?: boolean;
  naoExibirTituloTabelaRespostas?: boolean;
}

const SondagemListaDinamica: React.FC<
  ListaSondagemEscritaProps & { formListaDinamica: any }
> = ({ dados, formListaDinamica,podeSalvar = true, naoExibirTituloTabelaRespostas }) => {
  const mostrarColunaLP = dados?.tituloTabelaRespostas === "Sistema de escrita";
  const [opcoesCarregadas, setOpcoesCarregadas] = useState(false);
  const selectRefs = useRef<Map<string, any>>(new Map());
  const [selectOpenStates, setSelectOpenStates] = useState<
    Map<string, boolean>
  >(new Map());

  const setSelectRef = useCallback((key: string, ref: any) => {
    if (ref) {
      selectRefs.current.set(key, ref);
    } else {
      selectRefs.current.delete(key);
    }
  }, []);

  useEffect(() => {
    if (dados?.estudantes && dados.estudantes.length > 0) {
      setOpcoesCarregadas(true);
    }
  }, [dados]);

  useEffect(() => {
    if (opcoesCarregadas && dados?.estudantes) {
      const initialValues: any = {};

      dados.estudantes.forEach((estudante, estudanteIndex) => {
        initialValues[`linguaPortuguesaSegundaLingua_${estudanteIndex}`] =
          estudante.linguaPortuguesaSegundaLingua;

        estudante.coluna.forEach((coluna, colunaIndex) => {
          const respostaSelecionada = coluna.resposta;

          initialValues[`resposta_${estudanteIndex}_${colunaIndex}`] =
            respostaSelecionada?.opcaoRespostaId &&
            respostaSelecionada.opcaoRespostaId !== 0
              ? respostaSelecionada.opcaoRespostaId
              : undefined;

          initialValues[`respostaId_${estudanteIndex}_${colunaIndex}`] =
            respostaSelecionada?.id ?? "";
        });
      });

      formListaDinamica.setFieldsValue(initialValues);
    }
  }, [opcoesCarregadas, dados, formListaDinamica]);

  const getTotalColumns = useCallback(() => {
    return dados?.estudantes?.[0]?.coluna?.length ?? 0;
  }, [dados]);

  const isSelectOpen = useCallback(
    (row: number, col: number) => {
      const key = `${row}_${col}`;
      return selectOpenStates.get(key) || false;
    },
    [selectOpenStates],
  );

  const moveFocus = useCallback(
    (newRow: number, newCol: number) => {
      if (!dados?.estudantes) return;

      const totalRows = dados.estudantes.length;
      const totalCols = getTotalColumns();

      if (newRow < 0 || newRow >= totalRows) return;
      if (newCol < 0 || newCol >= totalCols) return;

      const targetKey = `${newRow}_${newCol}`;
      const targetRef = selectRefs.current.get(targetKey);

      if (targetRef?.focus) {
        setTimeout(() => targetRef.focus(), 0);
      }
    },
    [dados, getTotalColumns],
  );

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent, row: number, col: number) => {
      const totalCols = getTotalColumns();
      const isOpen = isSelectOpen(row, col);

      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          const prevCol = col === 0 ? totalCols - 1 : col - 1;
          moveFocus(row, prevCol);
        } else {
          const nextCol = (col + 1) % totalCols;
          moveFocus(row, nextCol);
        }
      } else if (e.key === "ArrowDown") {
        if (isOpen) {
          return;
        }
        e.preventDefault();
        moveFocus(row + 1, col);
      } else if (e.key === "ArrowUp") {
        if (isOpen) {
          return;
        }
        e.preventDefault();
        moveFocus(row - 1, col);
      }
    },
    [getTotalColumns, isSelectOpen, moveFocus],
  );

  const handleSelectOpen = useCallback(
    (row: number, col: number, open: boolean) => {
      setSelectOpenStates((prev) => {
        const newMap = new Map(prev);
        const key = `${row}_${col}`;
        newMap.set(key, open);
        return newMap;
      });
    },
    [],
  );

  useEffect(() => {
    if (opcoesCarregadas && dados?.estudantes && dados.estudantes.length > 0) {
      const firstKey = "0_0";
      const firstRef = selectRefs.current.get(firstKey);
      if (firstRef?.focus) {
        setTimeout(() => firstRef.focus(), 100);
      }
    }
  }, [opcoesCarregadas, dados]);

  const columns: ColumnsType<Estudante> = [];
  const columnsDinamicas: ColumnsType<Estudante> = [];

  if (mostrarColunaLP) {
    columns.push({
      title: (
        <span style={{ fontSize: "11px", whiteSpace: "normal" }}>
          LP como 2ª língua?
        </span>
      ),
      key: "lp",
      width: 110,
      align: "center",
      fixed: "left",
      render: (_, _record, index) => (
        <Form.Item
          name={`linguaPortuguesaSegundaLingua_${index}`}
          valuePropName="checked"
          style={{ margin: 0 }}
        >
          <Checkbox disabled={!podeSalvar} />
        </Form.Item>
      ),
    });
  }

  columns.push({
    title: "Estudantes",
    key: "estudante",
    width: mostrarColunaLP ? "40%" : "50%",
    fixed: "left",
    render: (_, record) => (
      <Space direction="vertical" size={0} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {record.numeroAlunoChamada} - {record.nome}
          </span>
          <Space size={4}>
            {record.pap && <LogoPAP />}
            {record.aee && <LogoAEE />}
            {record.possuiDeficiencia && <LogoAcessibilidade />}
          </Space>
        </div>
      </Space>
    ),
  });

  if (dados?.estudantes?.[0]?.coluna) {
    dados.estudantes[0].coluna.forEach((coluna, colunaIndex) => {
      columnsDinamicas.push({
        title: coluna.descricaoColuna,
        key: `coluna_${colunaIndex}`,
        width: 150,
        render: (_, record, estudanteIndex) => {
          const colunaEstudante = record.coluna[colunaIndex];
          const opcoesOrdenadas = [...colunaEstudante.opcaoResposta].sort(
            (a, b) => a.ordem - b.ordem,
          );
          const options = opcoesOrdenadas.map((opcao) => ({
            label: opcao.descricaoOpcaoResposta,
            value: opcao.id,
            corFundo: opcao.corFundo,
            corTexto: opcao.corTexto,
            ordem: opcao.ordem,
          }));

          const isDisabled = !podeSalvar || !colunaEstudante.periodoBimestreAtivo;

          return (
            <>
              <Form.Item
                name={`respostaId_${estudanteIndex}_${colunaIndex}`}
                hidden
                initialValue=""
                style={{ margin: 0 }}
              >
                <input type="hidden" />
              </Form.Item>

              <Form.Item
                name={`resposta_${estudanteIndex}_${colunaIndex}`}
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <SelectColorido
                  id={`select_${estudanteIndex}_${colunaIndex}`}
                  options={options}
                  placeholder="Selecione"
                  disabled={isDisabled}
                  style={{ width: "100%" }}
                  getPopupContainer={() => document.body}
                  placement="bottomLeft"
                  ref={(ref: any) =>
                    setSelectRef(`${estudanteIndex}_${colunaIndex}`, ref)
                  }
                  onKeyDown={(e: React.KeyboardEvent) =>
                    handleKeyNavigation(e, estudanteIndex, colunaIndex)
                  }
                  onOpenChange={(open: boolean) =>
                    handleSelectOpen(estudanteIndex, colunaIndex, open)
                  }
                />
              </Form.Item>
            </>
          );
        },
      });
    });

    if (naoExibirTituloTabelaRespostas) {
      columns.push(...columnsDinamicas);
    } else {
      columns.push({
        title: dados.tituloTabelaRespostas,
        children: [...columnsDinamicas],
      });
    }
  }

  if (!dados?.estudantes?.length) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Nenhum dado disponível para exibir.</p>
      </div>
    );
  }

  const dataSourceComIndice = dados.estudantes.map((estudante, index) => ({
    ...estudante,
    uniqueKey: `estudante_${index}_${estudante.numeroAlunoChamada}`,
  }));

  return (
    <div style={{ marginTop: 16, overflowX: "auto" }}>
      <ConfigProvider componentDisabled={!podeSalvar}>
        <Form form={formListaDinamica} component={false}>
          <Table
            key={`table-${podeSalvar}`}
            columns={columns}
            dataSource={dataSourceComIndice}
            rowKey={(record: any) => record.uniqueKey}
            pagination={false}
            scroll={{ x: "max-content", y: 600 }}
            bordered
            size="small"
            sticky
            className="custom-border-table"
          />
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default SondagemListaDinamica;
