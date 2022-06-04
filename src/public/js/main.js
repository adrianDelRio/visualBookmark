const form = document.getElementById("form");
form.addEventListener("submit", submitForm);

var numBookmarksLoaded = 0;
window.addEventListener('load', loadBookmarks);

async function submitForm(e) {
    e.preventDefault();
    const title = document.getElementById("title");
    const url = document.getElementById("url");
    const image = document.getElementById("files");
    const formData = new FormData();
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
            "<div class='card shadow-sm'>" +
                "<a href='" + objBookmarks[numBookmarksLoaded].url + "' target='_blank'><image class='bd-placeholder-img card-img-top' width='100%' height='225' id='bookmark' src='../bookmarks/" + objBookmarks[numBookmarksLoaded].image + "'></a>" +
                "<div class='card-body bg-dark'>" +
                    "<p class='card-text text-white'>" + objBookmarks[numBookmarksLoaded].title + "</p>" +
                    "<div class='d-flex justify-content-between align-items-center'>" +
                    "<div class='btn-group'>" +
                        "<button type='button' class='btn btn-sm btn-light'>Ver</button>" +
                        "<button type='button' class='btn btn-sm btn-secondary' data-bs-toggle='modal' data-bs-target='#addBookmark' data-bs-whatever='Titulo anterior'>Editar</button>" +
                        "<button type='button' class='btn btn-sm btn-danger'>Eliminar</button>" +
                    "</div>" +
                        "<small class='text-white'>9 mins</small>" +
                    "</div>" +
                  "</div>" +
              "</div>" +
        "</div>"
        
        numBookmarksLoaded++
      }
  })
  .catch((err) => ("Error occured", err));
}