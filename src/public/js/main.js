const submitedBookmark = document.getElementById("modBookmark");
submitedBookmark.addEventListener("submit", modBookmark);

var bookmarks;
var duplicates = [];
var numBookmarksLoaded = 0;
var ip = window.location.hostname;
window.addEventListener('load', loadBookmarks);

const updateBookmark = document.getElementById('modBookmark')
updateBookmark.addEventListener('show.bs.modal', visualEditOldBookmark);

const deleteBookmark = document.getElementById('removeBookmark')
deleteBookmark.addEventListener('show.bs.modal', visualRemoveBookmark);

const upDeletedBookmark = document.getElementById('removeBookmark')
upDeletedBookmark.addEventListener('submit', removeBookmark);

const sendToBookmarkId = document.getElementById('sendToBookmarkId')
sendToBookmarkId.addEventListener("submit", searchBookmark);

const duplicateBookmark = document.getElementById('duplicateBookmark')
duplicateBookmark.addEventListener('show.bs.modal', visualDuplicateBookmark);

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
    for (let i = 0; i < files.files.length; i++) {
      formData.append("files", files.files[0]);
    }
    await fetch("http://" + ip + ":3000/upload_bookmark", {
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
      setTimeout(function() { response.innerHTML = ""; }, 5000);
      // Actualizamos los marcadores mostrados
      // cuando se edita un marcador puede estar en cualquier posicion,
      // por lo que se recargan los marcadores en su totalidad
      numBookmarksLoaded = 0;
      var show = document.getElementById("showBookmarks");
      show.innerHTML = '';
      loadBookmarks();
    })
    .catch((err) => (console.log(err)));
}

function loadBookmarks() {
  // Recargamos los duplicados por si se han modificado
  duplicates = [];
  fetch("../bookmarks/bookmarks.json")
  .then(response => {
      return response.json();
   })
  .then(objBookmarks => {
      var show = document.getElementById("showBookmarks");
      var possibleId = 0;
      while (numBookmarksLoaded < objBookmarks["numBookmarks"]) {
        if (objBookmarks[possibleId] != undefined) {
          // Guardamos el id en el marcador
          objBookmarks[possibleId].id = possibleId;
          // Guardamos el idEmbellecido en el marcador
          objBookmarks[possibleId].idEmbellecido = numBookmarksLoaded;
          show.innerHTML += "<div class='col' id='" + numBookmarksLoaded + "'>" +
              "<div class='card shadow-sm p-1 bg-secondary'>" +
                  "<a href='" + objBookmarks[possibleId].url + "' target='_blank'><image class='bd-placeholder-img card-img-top' width='100%' height='225' id='bookmark' src='../bookmarks/" + objBookmarks[possibleId].image + "'></a>" +
                  "<div class='card-body bg-dark'>" +
                      "<p class='card-text text-white'>" + objBookmarks[possibleId].title + "</p>" +
                      "<div class='d-flex justify-content-between align-items-center'>" +
                      "<div class='btn-group'>" +
                          "<a href='" + objBookmarks[possibleId].url + "' target='_blank' type='button' class='btn btn-sm btn-light'>Ver</a>" +
                          "<button type='button' class='btn btn-sm btn-secondary' data-bs-toggle='modal' data-bs-target='#modBookmark' " +
                          "data-bs-bookmark-id='" + possibleId + "' data-bs-bookmark-title='" + objBookmarks[possibleId].title + "' data-bs-bookmark-url='" + objBookmarks[possibleId].url + "'>Editar</button>" +
                          "<button type='button' class='btn btn-sm btn-danger' data-bs-toggle='modal' data-bs-target='#removeBookmark' data-bs-bookmark-id='" + possibleId + "'>Eliminar</button>" +
                      "</div>" +
                    "<i class='card-text text-white'>#" + numBookmarksLoaded + "</i>" +
                  "</div>" +
              "</div>" +
          "</div>"
        
          numBookmarksLoaded++;
        }
        possibleId++;
      }
      // Almacenamos los bookmarks con idEmbellecido
      bookmarks = objBookmarks;
  })
  .catch((err) => (console.log(err)));
}

// Para pasar los datos antiguos del marcador al editarlo
function visualEditOldBookmark(e) {
  const button = e.relatedTarget
  // Obtengo la información de los atributos data-bs-*
  const idReal = button.getAttribute('data-bs-bookmark-id')
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
  if (idReal == null) {
    // Mostramos cambios sobre los modals
    modalTitle.textContent = 'Añadir nuevo marcador'
    modalBookmarkTitle.value = null
    modalBookmarkUrl.value = null
    modalBookmarkId.value = -1
    modalBookmarkNewImage.textContent = `Seleciona una imagen:`
  } else {  // Estamos editando un bookmark existente
    // Mostramos cambios sobre los modals
    modalTitle.textContent = `Editando Bookmark #${bookmarks[idReal].idEmbellecido}`
    modalBookmarkTitle.value = title
    modalBookmarkUrl.value = url
    modalBookmarkId.value = idReal
    modalBookmarkNewImage.textContent = `Seleciona una nueva imagen:`
  }
}

// Para pasar los datos antiguos del marcador al eliminarlo
function visualRemoveBookmark(e) {
  const button = e.relatedTarget
  // Obtengo la información de los atributos data-bs-*
  const idReal = button.getAttribute('data-bs-bookmark-id')

  // Seleccionamos los modals indicados
  const modalTitle = deleteBookmark.querySelector('.modal-title')
  const modalBody = deleteBookmark.querySelector('.modal-body')
  const modalBookmarkId = updateBookmark.querySelector('.modal-bookmark-id')

  // Mostramos cambios sobre los modals
  modalTitle.textContent = `Eliminar Bookmark #${bookmarks[idReal].idEmbellecido}`
  modalBody.textContent = `¿Seguro que quieres eliminar el Bookmark #${bookmarks[idReal].idEmbellecido}?`
  modalBookmarkId.value = idReal
}

async function removeBookmark(e) {
  e.preventDefault();
  const id = document.getElementById("id");
  await fetch("http://" + ip + ":3000/delete_bookmark", {
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
    setTimeout(function() { response.innerHTML = ""; }, 5000);
    // Actualizamos los marcadores mostrados
    // cuando se elimina un marcador puede estar en cualquier posicion,
    // por lo que se recargan los marcadores en su totalidad
    numBookmarksLoaded = 0;
    var show = document.getElementById("showBookmarks");
    show.innerHTML = '';
    loadBookmarks();
  })
  .catch((err) => (console.log(err)));
}

function searchBookmark(e) {  // Escuchar cuando se envíe el formulario
  e.preventDefault(); // Prevenimos que se envie
  // Comprobamos que es un id valido
  const id = sendToBookmarkId.querySelector("[name=q]").value;
  if (id == '' || id == null || id < 0 || id > numBookmarksLoaded-1 || isNaN(id)) {
    var response = document.getElementById("modBookmark-response");
    response.innerHTML +=
    '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
      '<b>¡Error!</b> El ID <i>"' + id + '"</i> no es válido' +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';
    setTimeout(function() { response.innerHTML = ""; }, 5000);
    return;
  }
  location.href = "#" + sendToBookmarkId.querySelector("[name=q]").value;
}

// Para buscar y mostrar los marcadores duplicados
function visualDuplicateBookmark() {
  // Seleccionamos los modals indicados
  const modalBody = duplicateBookmark.querySelector('.modal-body');

  // Encuentra elementos duplicados buscando por url y los almacena
  // en una variable de duplicados para su uso posterior (se actualizan
  // si los marcadores son modificados)
  if (duplicates.length == 0) {
    for (var i = 0; i < bookmarks["numMaxId"]; i++) {
      var iDuplicates = [];
      if (bookmarks[i] != undefined) {
        for (var j = 0; j < bookmarks["numMaxId"]; j++) {
          // Si los marcadores existen y son duplicados
          if (bookmarks[j] != undefined) {
            if ((i != j) && (bookmarks[i].url == bookmarks[j].url) && 
                ((bookmarks[i].shown == undefined) && (bookmarks[j].shown == undefined))) {
              // Si es el primero se integra el marcador del que es duplicado
              if (iDuplicates.length == 0) {
                iDuplicates.push(bookmarks[i]);
              }
              iDuplicates.push(bookmarks[j]);
              // Marcamos los marcadores duplicados
              // para no volverlos a mostrar
              bookmarks[j].shown = true;
            }
          }
        }
        // Solo anhadimos duplicados al array si hay alguno
        if (iDuplicates.length > 0) {
          duplicates.push(iDuplicates);
        }
      }
    }
  }
  
  // Muestra los marcadores duplicados
  modalBody.innerHTML = '';
  if (duplicates.length == 0) {
    modalBody.innerHTML += 
    '<p>¡<b>Woow</b>, parece que no tienes ningun bookmark duplicado!</p>';
  } else {
    var msgDuplicates = '';
    msgDuplicates += 
    '<p>Hemos encontrado los siguientes duplicados, selecciona el que quieras <b>eliminar</b>:</p>';
    for (var i = 0; i < duplicates.length; i++) {
      msgDuplicates += '<div class="list-group w-auto shadow-sm p-1 bg-secondary">';
      for (var j = 0; j < duplicates[i].length; j++) {
        msgDuplicates +=
          '<a href="#" class="list-group-item list-group-item-action d-flex gap-2 py-1 bg-dark" aria-current="true" data-bs-toggle="modal" data-bs-target="#removeBookmark" data-bs-bookmark-id="' + duplicates[i][j].id + '">' +
            '<img src="bookmarks/' + duplicates[i][j].image + '" alt="twbs" width="40" height="40" class="rounded-circle flex-shrink-0">' +
              '<div class="d-flex gap-2 w-100 justify-content-between">' +
                '<div>' +
                  '<h6 class="mb-0 text-white">' + duplicates[i][j].title + '</h6>' +
                  '<p class="mb-0 text-white opacity-75">' + duplicates[i][j].url + '</p>' +
                '</div>' +
                '<p class="opacity-50 text-white text-nowrap">#' + duplicates[i][j].idEmbellecido + '</p>' +
              '</div>' +
          '</a>';
      }
      msgDuplicates += '</div></br>';
      modalBody.innerHTML = msgDuplicates;
    }
  }
}