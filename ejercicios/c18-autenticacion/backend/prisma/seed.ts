import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma";
import { SALT_ROUNDS } from "../src/config/env";

// Idempotente: se puede correr N veces sin romper ni duplicar datos.

const autores = [
  { nombre: "Gabriel García Márquez", nacionalidad: "Colombia" },
  { nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { nombre: "Jorge Luis Borges", nacionalidad: "Argentina" },
  { nombre: "Ernesto Sabato", nacionalidad: "Argentina" },
];

const categorias = [{ nombre: "Novela" }, { nombre: "Cuento" }, { nombre: "Literatura latinoamericana" }];

// Sin id: lo asigna la base. autor y cats son nombres que se resuelven con connect
const libros = [
  { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", cats: ["Novela", "Literatura latinoamericana"], imagen: "/img/portada-1.jpg", precio: 18500, disponible: true },
  { titulo: "Rayuela", autor: "Julio Cortázar", cats: ["Novela", "Literatura latinoamericana"], imagen: "/img/portada-2.jpg", precio: 15900, disponible: true },
  { titulo: "Ficciones", autor: "Jorge Luis Borges", cats: ["Cuento", "Literatura latinoamericana"], imagen: "/img/portada-3.jpg", precio: 14200, disponible: false },
  { titulo: "El túnel", autor: "Ernesto Sabato", cats: ["Novela", "Literatura latinoamericana"], imagen: "/img/portada-4.jpg", precio: 12800, disponible: true },
];

// Credenciales SOLO de desarrollo: nunca usar estos usuarios ni claves en producción.
const usuarios = [
  { email: "admin@libreria.test", nombre: "Admin", rol: "ADMIN" as const, password: "Admin1234" },
  { email: "cliente@libreria.test", nombre: "Cliente", rol: "CLIENTE" as const, password: "Cliente1234" },
];

async function main() {
  // Autores y categorías primero: si no, el libro apunta a algo que no existe (P2003).
  // skipDuplicates: si el nombre (@unique) ya existe, lo saltea en vez de tirar P2002.
  await prisma.autor.createMany({ data: autores, skipDuplicates: true });
  await prisma.categoria.createMany({ data: categorias, skipDuplicates: true });

  // Libro no tiene campo único para upsert: solo se cargan si la tabla está vacía
  if ((await prisma.libro.count()) === 0) {
    for (const { autor, cats, ...datos } of libros) {
      await prisma.libro.create({
        data: {
          ...datos,
          autor: { connect: { nombre: autor } },
          categorias: { connect: cats.map((nombre) => ({ nombre })) },
        },
      });
    }
  }

  // password se separa: no es columna de Usuario. Al resto (email, nombre, rol) se le
  // agrega el hash. upsert por email: si ya existe no lo toca (update vacío), si no, lo crea.
  for (const { password, ...datos } of usuarios) {
    await prisma.usuario.upsert({
      where: { email: datos.email },
      update: {},
      create: { ...datos, passwordHash: await bcrypt.hash(password, SALT_ROUNDS) },
    });
  }

  console.log("Seed completo");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
