// Catálogo dinámico: búsqueda de libros en Open Library

const API_BUSQUEDA = "https://openlibrary.org/search.json";
const API_PORTADAS = "https://covers.openlibrary.org/b/id";
const PORTADA_DEFAULT = "img/sin-portada.svg";
const MAX_RESULTADOS = 10;

const formBusqueda = document.querySelector("#form-busqueda");
const inputBusqueda = document.querySelector("#input-busqueda");
const resultados = document.querySelector("#resultados");

// Evita que el texto que llega de la API se interprete como HTML
const escaparHtml = (texto) =>
  String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Muestra un aviso de Bootstrap dentro de #resultados
const mostrarMensaje = (texto, tipo) => {
  resultados.innerHTML = `<div class="alert alert-${tipo}" role="alert">${texto}</div>`;
};

const mostrarCargando = () => {
  resultados.innerHTML = `
    <div class="d-flex align-items-center gap-2 text-body-secondary">
      <div class="spinner-border spinner-border-sm" aria-hidden="true"></div>
      <span>Cargando...</span>
    </div>`;
};

// Arma la card de un libro; autor, año y portada pueden faltar
const crearCard = (libro) => {
  const titulo = escaparHtml(libro.title ?? "Sin título");
  const autor = escaparHtml(libro.author_name?.join(", ") ?? "Autor desconocido");
  const anio = libro.first_publish_year ?? "Año desconocido";
  const portada = libro.cover_i
    ? `${API_PORTADAS}/${libro.cover_i}-M.jpg`
    : PORTADA_DEFAULT;

  return `
    <div class="col">
      <article class="card h-100">
        <img src="${portada}" class="card-img-top portada" alt="Portada de ${titulo}">
        <div class="card-body">
          <h2 class="card-title h5">${titulo}</h2>
          <p class="card-text text-body-secondary mb-1">${autor}</p>
          <p class="card-text"><small>${anio}</small></p>
        </div>
      </article>
    </div>`;
};

const buscarLibros = async (texto) => {
  mostrarCargando();

  try {
    const response = await fetch(`${API_BUSQUEDA}?q=${encodeURIComponent(texto)}`);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    const libros = (data.docs ?? []).slice(0, MAX_RESULTADOS);

    if (libros.length === 0) {
      mostrarMensaje(`No se encontraron resultados para "${escaparHtml(texto)}".`, "warning");
      return;
    }

    resultados.innerHTML = `
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 g-4">
        ${libros.map(crearCard).join("")}
      </div>`;
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudo obtener el catálogo. Revisá tu conexión e intentá de nuevo.", "danger");
  }
};

// Solo se activa en la página que tiene el buscador
if (formBusqueda && inputBusqueda && resultados) {
  formBusqueda.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = inputBusqueda.value.trim();

    if (texto === "") {
      mostrarMensaje("Escribí un título, autor o tema para buscar.", "danger");
      return;
    }

    buscarLibros(texto);
  });
}
