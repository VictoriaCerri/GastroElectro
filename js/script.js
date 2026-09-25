// ==========================================
// Electro VEM - Productos desde Google Sheets
// ==========================================

const URL_SHEET =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvJDnWyt2q-NEdVtFDAZZuzO84oagk-x9SSpC6Rhndy3C_xikD41YERsukzH6WGQNO2jFYH7XJNVBX/pub?gid=1839928840&single=true&output=csv";

const listaProductos = document.getElementById("lista-productos");

// Guardamos los productos para poder filtrarlos después
let productos = [];


// ==========================================
// Obtener productos desde Google Sheets
// ==========================================

fetch(URL_SHEET)
    .then(response => response.text())
    .then(csv => {

        const filas = csv.trim().split("\n");

        // Primera fila = encabezados
        const encabezados = filas[0].split(",");

        // Convertir cada fila en un producto
        productos = filas.slice(1).map(fila => {

            const columnas = fila.split(",");

            return {
                codigo: columnas[2],
                nombre: columnas[3],
                categoria: columnas[4],
                subcategoria: columnas[5],
                marca: columnas[6],
                modelo: columnas[7],
                caracteristica: columnas[8],
                stock: Number(columnas[9]),
                imagen: `img/productos/${columnas[2]}.jpg`
            };

        });

        console.log(
            "Productos cargados desde Google Sheets:",
            productos
        );

        // NO mostramos los productos al cargar la página
        listaProductos.innerHTML = "";

    })
    .catch(error => {

        console.error("Error al cargar Google Sheets:", error);

        listaProductos.innerHTML = `
            <p>
                No se pudieron cargar los productos.
            </p>
        `;

    });


    // ==========================================
// Buscador de productos
// ==========================================

const buscador = document.getElementById("buscador-productos");

buscador.addEventListener("input", () => {

    const textoBuscado = buscador.value
        .trim()
        .toLowerCase();

    // Si el buscador está vacío, no mostramos productos
    if (textoBuscado === "") {

        listaProductos.innerHTML = "";

        return;
    }

    // Buscar coincidencias
    const productosEncontrados = productos.filter(producto => {

        return (
            producto.codigo.toLowerCase().includes(textoBuscado) ||
            producto.nombre.toLowerCase().includes(textoBuscado) ||
            producto.categoria.toLowerCase().includes(textoBuscado) ||
            producto.subcategoria.toLowerCase().includes(textoBuscado) ||
            producto.marca.toLowerCase().includes(textoBuscado) ||
            producto.modelo.toLowerCase().includes(textoBuscado) ||
            producto.caracteristica.toLowerCase().includes(textoBuscado)
        );

    });

    console.log(
        "Resultados de búsqueda:",
        productosEncontrados
    );

    mostrarProductos(productosEncontrados);

});

// ==========================================
// Filtros por categoría
// ==========================================

document.querySelectorAll(".categoria").forEach(categoria => {

    categoria.addEventListener("click", () => {

        const categoriaSeleccionada =
            categoria.dataset.categoria.trim().toLowerCase();

        console.log(
            "Categoría seleccionada:",
            categoriaSeleccionada
        );

        const productosFiltrados = productos.filter(producto => {

            return producto.categoria
                .trim()
                .toLowerCase() === categoriaSeleccionada;

        });

        console.log(
            "Productos encontrados:",
            productosFiltrados
        );

        // Mostrar solamente los productos de esa categoría
        mostrarProductos(productosFiltrados);

        // Bajar hasta la sección de productos
        document
            .getElementById("productos")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ==========================================
// Mostrar productos
// ==========================================

function mostrarProductos(productos) {

    listaProductos.innerHTML = "";

    console.log("MOSTRAR PRODUCTOS:", productos);

    // Si no hay productos
    if (productos.length === 0) {

        listaProductos.innerHTML = `
            <p class="sin-productos">
                No hay productos disponibles en esta categoría.
            </p>
        `;

        return;
    }

    productos.forEach(producto => {

        const tarjeta = document.createElement("article");

        tarjeta.classList.add("producto");

        // Determinar estado según stock
        let estado = "";

        if (producto.stock === 0) {
            estado = "🔴 Sin stock";
        } 
        else if (producto.stock === 1) {
            estado = "🟡 Última unidad";
        } 
        else {
            estado = "🟢 Disponible";
        }

        tarjeta.innerHTML = `

            <div class="producto-img">

                <img 
                    src="${producto.imagen}" 
                    alt="${producto.nombre}"
                >

            </div>

            <div class="producto-info">

                <span class="producto-estado">
                    ${estado}
                </span>

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    <strong>Categoría:</strong>
                    ${producto.categoria}
                    <br>

                    <strong>Marca:</strong>
                    ${producto.marca}
                    <br>

                    <strong>Modelo:</strong>
                    ${producto.modelo}
                </p>

                <p>
                    <strong>Descripción:</strong>
                    <br>
                    ${producto.caracteristica}
                </p>

                <a href="#contacto" class="boton">
                    Consultar
                </a>

            </div>

        `;

        listaProductos.appendChild(tarjeta);

    });

}