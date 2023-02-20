import generateQR from "@zeniquiz/functions";

declare module "@zeniquiz/functions";

declare function generateQR(URL: string): Promise<string>

export { generateQR }