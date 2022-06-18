const submitedBookmark = document.getElementById("modBookmark");
submitedBookmark.addEventListener("submit", modBookmark);

var numBookmarksLoaded = 0;
window.addEventListener('load', loadBookmarks);

const updateBookmark = document.getElementById('modBookmark')
updateBookmark.addEventListener('show.bs.modal', visualEditOldBookmark);

const deleteBookmark = document.getElementById('removeBookmark')
deleteBookmark.addEventListener('show.bs.modal', visualRemoveBookmark);

const upDeletedBookmark = document.getElementById('removeBookmark')
upDeletedBookmark.addEventListener('submit', removeBookmark);

async function modBookmark(e) {
    e.preventDefault();
    const id = document.getElementById("id");
    const title = document.getElementById("title");
    const url = document.getElementById("url");
    const image = document.getElementById("files");
    const formData = new FormData();
    formData.append("id", id.value);
    formData.append("title", title.value);
    formData.append("url", url.value);
    for(let i = 0; i < files.files.length; i++) {
      formData.append("files", files.files[0]);
    }
    await fetch("http://127.0.0.1:3000/upload_bookmark", {
        method: 'POST',
        body: formData,
    })
    .then(res => {
      console.log(res);
      var response = document.getElementById("modBookmark-response");
      if (res.status == 200) {
        response.innerHTML += 
      '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
        '¡La <b>modificación</b> se ha realizado correctamente!' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
      '</div>';
      } else {
        response.innerHTML += 
      '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
        'Algo ha ido mal.. Revisa la consola para más información' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
      '</div>';
      }
      // Actualizamos los marcadores mostrados
      // cuando se edita un marcador puede estar en cualquier posicion,
      // por lo que se recargan los marcadores en su totalidad
      numBookmarksLoaded = 0;
      var show = document.getElementById("showBookmarks");
      show.innerHTML = '';
      loadBookmarks();
    })
    .catch((err) => ("Error occured", err));
}

function loadBookmarks() {
  fetch("../bookmarks/bookmarks.json")
  .then(response => {
      return response.json();
   })
  .then(objBookmarks => {
      var show = document.getElementById("showBookmarks");
      var possibleId = 0;
      while (numBookmarksLoaded < objBookmarks["numBookmarks"]) {
        if (objBookmarks[possibleId] != undefined) {
          show.innerHTML += "<div class='col'>" +
              "<div class='card shadow-sm p-1 bg-secondary'>" +
                  "<a href='" + objBookmarks[possibleId].url + "' target='_blank'><image class='bd-placeholder-img card-img-top' width='100%' height='225' id='bookmark' src='../bookmarks/" + objBookmarks[possibleId].image + "'></a>" +
                  "<div class='card-body bg-dark'>" +
                      "<p class='card-text text-white'>" + objBookmarks[possibleId].title + "</p>" +
                      "<div class='d-flex justify-content-between align-items-center'>" +
                      "<div class='btn-group'>" +
                          "<a href='" + objBookmarks[possibleId].url + "' type='button' class='btn btn-sm btn-light'>Ver</a>" +
                          "<button type='button' class='btn btn-sm btn-secondary' data-bs-toggle='modal' data-bs-target='#modBookmark' " +
                          "data-bs-bookmark-id='" + possibleId + "' data-bs-bookmark-title='" + objBookmarks[possibleId].title + "' data-bs-bookmark-url='" + objBookmarks[possibleId].url + "'>Editar</button>" +
                          "<button type='button' class='btn btn-sm btn-danger' data-bs-toggle='modal' data-bs-target='#removeBookmark' data-bs-bookmark-id='" + possibleId + "'>Eliminar</button>" +
                      "</div>" +
                    "<i class='card-text text-white'>#" + possibleId + "</i>" +
                  "</div>" +
              "</div>" +
          "</div>"
        
        numBookmarksLoaded++;
        }
      possibleId++;
      }
  })
  .catch((err) => ("Error occured", err));
}

// Para pasar los datos antiguos del marcador al editarlo
function visualEditOldBookmark(e) {
  const button = e.relatedTarget
  // Obtengo la información de los atributos data-bs-*
  const id = button.getAttribute('data-bs-bookmark-id')
  const title = button.getAttribute('data-bs-bookmark-title')
  const url = button.getAttribute('data-bs-bookmark-url')

  // Seleccionamos los modals indicados
  const modalTitle = updateBookmark.querySelector('.modal-title')
  const modalBookmarkId = updateBookmark.querySelector('.modal-bookmark-id')
  const modalBookmarkTitle = updateBookmark.querySelector('.modal-bookmark-title')
  const modalBookmarkUrl = updateBookmark.querySelector('.modal-bookmark-url')
  const modalBookmarkNewImage = updateBookmark.querySelector('.modal-bookmark-new-image')

  // Si es un nuevo bookmark no se muestran los datos antiguos
  // Solo cuando se utiliza el boton de edición existen los atributos
  if (id == null) {
    // Mostramos cambios sobre los modals
    modalTitle.textContent = 'Añadir nuevo marcador'
    modalBookmarkTitle.value = null
    modalBookmarkUrl.value = null
    modalBookmarkId.value = -1
    modalBookmarkNewImage.textContent = `Seleciona una imagen:`
  } else {  // Estamos editando un bookmark existente
    // Mostramos cambios sobre los modals
    modalTitle.textContent = `Editando Bookmark #${id}`
    modalBookmarkTitle.value = title
    modalBookmarkUrl.value = url
    modalBookmarkId.value = id
    modalBookmarkNewImage.textContent = `Seleciona una nueva imagen:`
  }
}

// Para pasar los datos antiguos del marcador al eliminarlo
function visualRemoveBookmark(e) {
  const button = e.relatedTarget
  // Obtengo la información de los atributos data-bs-*
  const id = button.getAttribute('data-bs-bookmark-id')

  // Seleccionamos los modals indicados
  const modalTitle = deleteBookmark.querySelector('.modal-title')
  const modalBody = deleteBookmark.querySelector('.modal-body')
  const modalBookmarkId = updateBookmark.querySelector('.modal-bookmark-id')

  // Mostramos cambios sobre los modals
  modalTitle.textContent = `Eliminar Bookmark #${id}`
  modalBody.textContent = `¿Seguro que quieres eliminar el Bookmark #${id}?`
  modalBookmarkId.value = id
}

async function removeBookmark(e) {
  e.preventDefault();
  const id = document.getElementById("id");
  await fetch("http://127.0.0.1:3000/delete_bookmark", {
      method: 'POST',
      body: 'id=' + id.value,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
  })
  .then(res => {
    console.log(res);
    var response = document.getElementById("modBookmark-response");
    if (res.status == 200) {
      response.innerHTML += 
    '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
      '¡El marcador ha sido <b>eliminado</b> correctamente!' +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';
    } else {
      response.innerHTML += 
    '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
      'Algo ha ido mal.. Revisa la consola para más información' +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';
    }
    // Actualizamos los marcadores mostrados
    // cuando se elimina un marcador puede estar en cualquier posicion,
    // por lo que se recargan los marcadores en su totalidad
    numBookmarksLoaded = 0;
    var show = document.getElementById("showBookmarks");
    show.innerHTML = '';
    loadBookmarks();
  })
  .catch((err) => ("Error occured", err));
}