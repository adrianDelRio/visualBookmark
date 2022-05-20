const form = document.getElementById("form");
form.addEventListener("submit", submitForm);

var numBookmarksLoaded = 0;
window.addEventListener('load', loadBookmarks);

function submitForm(e) {
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
    fetch("http://127.0.0.1:3000/upload_bookmark", {
        method: 'POST',
        body: formData,
    })
    .then(res => {
      console.log(res);
    })
    .then(reloadBookmarks => {
      loadBookmarks();
    })
    .catch((err) => ("Error occured", err));

    ;
}

function loadBookmarks() {
  fetch("../bookmarks/bookmarks.json")
  .then(response => {
      return response.json();
   })
  .then(objBookmarks => {
      var show = document.getElementById("muestraDatos");
      while (numBookmarksLoaded < objBookmarks["numBookmarks"]) {
        show.innerHTML += "<p id='datosSimulados'>El titulo " + numBookmarksLoaded + " es: " +
        objBookmarks[numBookmarksLoaded].title + "<br/>" +
        "La URL " + numBookmarksLoaded + " es: " + 
        objBookmarks[numBookmarksLoaded].url + "<br/><p>";
        numBookmarksLoaded++
      }
  })
  .catch((err) => ("Error occured", err));
}