import { prisma } from "../src/config/prisma";

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

async function main() {
  // Autores y categorías primero: si no, el libro apunta a algo que no existe (P2003)
  await prisma.autor.createMany({ data: autores });
  await prisma.categoria.createMany({ data: categorias });
  for (const { autor, cats, ...datos } of libros) {
    await prisma.libro.create({
      data: {
        ...datos,
        autor: { connect: { nombre: autor } },
        categorias: { connect: cats.map((nombre) => ({ nombre })) },
      },
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
