const urlBase = import.meta.env.VITE_URL_API;
const obterUrlSondagem = import.meta.env.VITE_URL_SONDAGEM;
const obterUrlSignalR = import.meta.env.VITE_URL_SIGNALR;
const obterTrackingID = import.meta.env.VITE_TRACKING_ID || "";
const urlApiCES = import.meta.env.VITE_CES_URL || "";
const tokenCES = import.meta.env.VITE_CES_TOKEN || "";
export {
  urlBase,
  obterUrlSondagem,
  obterUrlSignalR,
  obterTrackingID,
  urlApiCES,
  tokenCES,
};
