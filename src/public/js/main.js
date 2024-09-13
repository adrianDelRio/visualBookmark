const submitedBookmark = document.getElementById("modBookmark");
submitedBookmark.addEventListener("submit", modBookmark);

var bookmarks;
var duplicates = [];
var numBookmarksLoaded = 0;
var ip = window.location.hostname;
window.addEventListener('load', loadBookmarks);

const updateBookmark = document.getElementById('modBookmark');
updateBookmark.addEventListener('show.bs.modal', visualEditOldBookmark);

const deleteBookmark = document.getElementById('removeBookmark');
deleteBookmark.addEventListener('show.bs.modal', visualRemoveBookmark);

const upDeletedBookmark = document.getElementById('removeBookmark');
upDeletedBookmark.addEventListener('submit', removeBookmark);

const sendToBookmarkId = document.getElementById('sendToBookmarkId');
sendToBookmarkId.addEventListener("submit", searchBookmark);

const duplicateBookmark = document.getElementById('duplicateBookmark');
duplicateBookmark.addEventListener('show.bs.modal', visualDuplicateBookmark);

// Función para modificar o añadir un marcador
async function modBookmark(e) {
    e.preventDefault();

    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;
    const filesInput = document.getElementById("files");
    const formData = new FormData();

    formData.append("id", id);
    formData.append("title", title);
    formData.append("url", url);

    // Agregar archivos si existen
    if (filesInput.files.length > 0) {
        formData.append("files", filesInput.files[0]);
    }

    try {
        const response = await fetch(`http://${ip}:3000/api/bookmarks/upload`, {
            method: 'POST',
            body: formData,
        });

        const modResponse = document.getElementById("modBookmark-response");

        if (response.ok) {
            modResponse.innerHTML +=
                `<div class="alert alert-success alert-dismissible fade show" role="alert">
                ¡La <b>modificación</b> se ha realizado correctamente!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        } else {
            modResponse.innerHTML +=
                `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                Algo ha ido mal.. Revisa la consola para más información
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        }

        setTimeout(() => { modResponse.innerHTML = ""; }, 5000);
        // FIXME Refactorizar para no recargar todos los marcadores,
        // solo el que se ha creado/modificado
        numBookmarksLoaded = 0;
        document.getElementById("showBookmarks").innerHTML = '';
        loadBookmarks();
    } catch (error) {
        console.error('Error al modificar el bookmark:', error);
    }
}

// Función para cargar los marcadores desde el JSON
function loadBookmarks() {
    duplicates = [];
    fetch("../bookmarks/bookmarks.json")
        .then(response => response.json())
        .then(objBookmarks => {
            const show = document.getElementById("showBookmarks");
            let possibleId = 0;
            while (numBookmarksLoaded < objBookmarks.numBookmarks) {
                if (objBookmarks[possibleId] !== undefined) {
                    objBookmarks[possibleId].id = possibleId;
                    objBookmarks[possibleId].idEmbellecido = numBookmarksLoaded;
                    show.innerHTML += `
                    <div class='col' id='${numBookmarksLoaded}'>
                        <div class='card shadow-sm p-1 bg-secondary'>
                            <a href='${objBookmarks[possibleId].url}' target='_blank'>
                                <img class='bd-placeholder-img card-img-top' width='100%' height='225' src='../bookmarks/${objBookmarks[possibleId].image}'>
                            </a>
                            <div class='card-body bg-dark'>
                                <p class='card-text text-white'>${objBookmarks[possibleId].title}</p>
                                <div class='d-flex justify-content-between align-items-center'>
                                    <div class='btn-group'>
                                        <a href='${objBookmarks[possibleId].url}' target='_blank' class='btn btn-sm btn-light'>Ver</a>
                                        <button type='button' class='btn btn-sm btn-secondary' data-bs-toggle='modal' data-bs-target='#modBookmark' 
                                            data-bs-bookmark-id='${possibleId}' data-bs-bookmark-title='${objBookmarks[possibleId].title}' data-bs-bookmark-url='${objBookmarks[possibleId].url}'>Editar</button>
                                        <button type='button' class='btn btn-sm btn-danger' data-bs-toggle='modal' data-bs-target='#removeBookmark' data-bs-bookmark-id='${possibleId}'>Eliminar</button>
                                    </div>
                                    <i class='card-text text-white'>#${numBookmarksLoaded}</i>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    numBookmarksLoaded++;
                }
                possibleId++;
            }
            bookmarks = objBookmarks;
        })
        .catch(err => console.error('Error al cargar los marcadores:', err));
}

// Función para mostrar los datos del marcador al editar
function visualEditOldBookmark(e) {
    const button = e.relatedTarget;
    const idReal = button.getAttribute('data-bs-bookmark-id');
    const title = button.getAttribute('data-bs-bookmark-title');
    const url = button.getAttribute('data-bs-bookmark-url');

    const modalTitle = updateBookmark.querySelector('.modal-title');
    const modalBookmarkId = updateBookmark.querySelector('.modal-bookmark-id');
    const modalBookmarkTitle = updateBookmark.querySelector('.modal-bookmark-title');
    const modalBookmarkUrl = updateBookmark.querySelector('.modal-bookmark-url');
    const modalBookmarkNewImage = updateBookmark.querySelector('.modal-bookmark-new-image');

    if (idReal == null) {
        modalTitle.textContent = 'Añadir nuevo marcador';
        modalBookmarkTitle.value = null;
        modalBookmarkUrl.value = null;
        modalBookmarkId.value = -1;
        modalBookmarkNewImage.textContent = `Selecciona una imagen:`;
    } else {
        modalTitle.textContent = `Editando Bookmark #${bookmarks[idReal].idEmbellecido}`;
        modalBookmarkTitle.value = title;
        modalBookmarkUrl.value = url;
        modalBookmarkId.value = idReal;
        modalBookmarkNewImage.textContent = `Selecciona una nueva imagen:`;
    }
}

// Función para mostrar los datos del marcador al eliminar
function visualRemoveBookmark(e) {
    const button = e.relatedTarget;
    const idReal = button.getAttribute('data-bs-bookmark-id');

    const modalTitle = deleteBookmark.querySelector('.modal-title');
    const modalBody = deleteBookmark.querySelector('.modal-body');
    const modalBookmarkId = updateBookmark.querySelector('.modal-bookmark-id');

    modalTitle.textContent = `Eliminar Bookmark #${bookmarks[idReal].idEmbellecido}`;
    modalBody.textContent = `¿Seguro que quieres eliminar el Bookmark #${bookmarks[idReal].idEmbellecido}?`;
    modalBookmarkId.value = idReal;
}

// Función para eliminar un marcador
async function removeBookmark(e) {
    e.preventDefault();
    const id = document.getElementById("id").value;
    try {
        const response = await fetch(`http://${ip}:3000/api/bookmarks/delete`, {
            method: 'POST',
            body: new URLSearchParams({ id }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const modResponse = document.getElementById("modBookmark-response");
        if (response.ok) {
            modResponse.innerHTML +=
                `<div class="alert alert-success alert-dismissible fade show" role="alert">
                ¡El marcador ha sido <b>eliminado</b> correctamente!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        } else {
            modResponse.innerHTML +=
                `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                Algo ha ido mal.. Revisa la consola para más información
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        }

        setTimeout(() => { modResponse.innerHTML = ""; }, 5000);
        // FIXME Refactorizar para no recargar todos los marcadores,
        // solo el que se ha creado/modificado
        numBookmarksLoaded = 0;
        document.getElementById("showBookmarks").innerHTML = '';
        loadBookmarks();
    } catch (error) {
        console.error('Error al eliminar el bookmark:', error);
    }
}

// Función para buscar y mostrar un marcador por ID
function searchBookmark(e) {
    e.preventDefault();
    const id = sendToBookmarkId.querySelector("[name=q]").value;
    const modResponse = document.getElementById("modBookmark-response");
    if (id == '' || id == null || id < 0 || id > numBookmarksLoaded - 1 || isNaN(id)) {
        modResponse.innerHTML +=
            `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <b>¡Error!</b> El ID <i>"${id}"</i> no existe.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        setTimeout(() => { modResponse.innerHTML = ""; }, 3000);
    } else {
        const element = document.getElementById(id);
        const originalClasses = element.className;
        element.classList.remove('p-1', 'bg-secondary');
        element.classList.add('bg-warning');
        element.scrollIntoView();
        setTimeout(() => {
            element.className = originalClasses;
        }, 5000);
    }
}

// Función para duplicar un marcador
function visualDuplicateBookmark() {
    const modalBody = duplicateBookmark.querySelector('.modal-body');
    modalBody.innerHTML = '';
    duplicates = [];

    // Recorremos todos los marcadores y agrupamos por URL
    const urlMap = new Map();
    for (let i = 0; i < bookmarks.numMaxId; i++) {
        const bookmark = bookmarks[i];
        if (bookmark) {
            const { url } = bookmark;
            if (!urlMap.has(url)) {
                urlMap.set(url, []);
            }
            urlMap.get(url).push(bookmark);
        }
    }

    // Filtramos solo aquellos grupos con más de un marcador (es decir, duplicados)
    urlMap.forEach((group) => {
        if (group.length > 1) {
            duplicates.push(group);
        }
    });

    // Generamos el HTML con el output
    if (duplicates.length === 0) {
        modalBody.innerHTML = '<p>¡<b>Woow</b>, parece que no tienes ningún bookmark duplicado!</p>';
        return;
    }

    let duplicatesHTML = '<p>Hemos encontrado los siguientes duplicados, selecciona el que quieras <b>eliminar</b>:</p>';
    duplicates.forEach((group) => {
        duplicatesHTML += '<div class="list-group w-auto shadow-sm p-1 bg-secondary">';
        group.forEach((bookmark) => {
            duplicatesHTML += `
                <a href="#" class="list-group-item list-group-item-action d-flex gap-2 py-1 bg-dark" aria-current="true" data-bs-toggle="modal" data-bs-target="#removeBookmark" data-bs-bookmark-id="${bookmark.id}">
                    <img src="bookmarks/${bookmark.image}" alt="Imagen de ${bookmark.title}" width="40" height="40" class="rounded-circle flex-shrink-0">
                    <div class="d-flex gap-2 w-100 justify-content-between">
                        <div>
                            <h6 class="mb-0 text-white">${bookmark.title}</h6>
                            <p class="mb-0 text-white opacity-75">${bookmark.url}</p>
                        </div>
                        <p class="opacity-50 text-white text-nowrap">#${bookmark.idEmbellecido}</p>
                    </div>
                </a>`;
        });
        duplicatesHTML += '</div><br>';
    });

    modalBody.innerHTML = duplicatesHTML;
}
