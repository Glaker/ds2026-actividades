// Extiende el Request de Express con req.usuario (lo carga authenticate).
// "export {}" hace que el archivo sea un módulo; sin eso, declare global no aplica.
// Tiene que estar dentro de "include" del tsconfig (src/), o TS tira TS2339 en req.usuario.
export {};

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number; rol: "ADMIN" | "CLIENTE" };
    }
  }
}
