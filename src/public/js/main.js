const submitedBookmark = document.getElementById("modBookmark");
submitedBookmark.addEventListener("submit", modBookmark);

var numBookmarksLoaded = 0;
window.addEventListener('load', loadBookmarks);

const updateBookmark = document.getElementById('modBookmark')
updateBookmark.addEventListener('show.bs.modal', visualEditOldBookmark);

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
        '¡El marcador ha sido añadido correctamente!' +
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
      while (numBookmarksLoaded < objBookmarks["numBookmarks"]) {
        show.innerHTML += "<div class='col'>" +
            "<div class='card shadow-sm p-1 bg-secondary'>" +
                "<a href='" + objBookmarks[numBookmarksLoaded].url + "' target='_blank'><image class='bd-placeholder-img card-img-top' width='100%' height='225' id='bookmark' src='../bookmarks/" + objBookmarks[numBookmarksLoaded].image + "'></a>" +
                "<div class='card-body bg-dark'>" +
                    "<p class='card-text text-white'>" + objBookmarks[numBookmarksLoaded].title + "</p>" +
                    "<div class='btn-group'>" +
                        "<a href='" + objBookmarks[numBookmarksLoaded].url + "' type='button' class='btn btn-sm btn-light'>Ver</a>" +
                        // TODO: Editar y eliminar
                        "<button id='editBookmark' type='button' class='btn btn-sm btn-secondary' data-bs-toggle='modal' data-bs-target='#modBookmark' " +
                        "data-bs-bookmark-id='" + numBookmarksLoaded + "' data-bs-bookmark-title='" + objBookmarks[numBookmarksLoaded].title + "' data-bs-bookmark-url='" + objBookmarks[numBookmarksLoaded].url + "'>Editar</button>" +
                        //"<button type='button' class='btn btn-sm btn-danger'>Eliminar</button>" +
                    "</div>" +
                  "</div>" +
              "</div>" +
        "</div>"
        
        numBookmarksLoaded++
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

  // Si es un nuevo bookmark no se muestran los datos antiguos
  // Solo cuando se utiliza el boton de edición existen los atributos
  if (id == null) {
    return
  }

  // Seleccionamos los modals indicados
  const modalTitle = updateBookmark.querySelector('.modal-title')
  const modalBookmarkTitle = updateBookmark.querySelector('.modal-bookmark-title')
  const modalBookmarkUrl = updateBookmark.querySelector('.modal-bookmark-url')

  // Mostramos cambios sobre los modals
  modalTitle.textContent = `Editando bookmark #${id}`
  modalBookmarkTitle.value = title
  modalBookmarkUrl.value = url
}