import QRCode from "qrcode";

export const generateQR = async (URL: string): Promise<string> =>
  QRCode.toDataURL(URL, {
    width: 500,
    color: {
      dark: "#eb213a",
      light: "#ffffff",
    },
  });
