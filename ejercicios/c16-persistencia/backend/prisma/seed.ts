import { prisma } from "../src/config/prisma";

const libros = [
  { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", imagen: "/img/portada-1.jpg", precio: 18500, disponible: true },
  { titulo: "Rayuela", autor: "Julio Cortázar", imagen: "/img/portada-2.jpg", precio: 15900, disponible: true },
  { titulo: "Ficciones", autor: "Jorge Luis Borges", imagen: "/img/portada-3.jpg", precio: 14200, disponible: false },
  { titulo: "El túnel", autor: "Ernesto Sabato", imagen: "/img/portada-4.jpg", precio: 12800, disponible: true },
];

const autores = [
  { nombre: "Gabriel García Márquez", nacionalidad: "Colombia" },
  { nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { nombre: "Jorge Luis Borges", nacionalidad: "Argentina" },
];

async function main() {
  await prisma.libro.createMany({ data: libros });
  await prisma.autor.createMany({ data: autores });
  console.log("Seed completo");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
