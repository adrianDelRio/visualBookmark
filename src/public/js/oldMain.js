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
      var show = document.getElementById("muestraDatos");
      while (numBookmarksLoaded < objBookmarks["numBookmarks"]) {
        show.innerHTML += "<a href='" + objBookmarks[numBookmarksLoaded].url + "' target='_blank'>" +
        "<image id='bookmark' src='../bookmarks/" + objBookmarks[numBookmarksLoaded].image + "'" +
        " alt='Requires default.jpg' title='" + objBookmarks[numBookmarksLoaded].title + "'>" +
        "</a>"
        numBookmarksLoaded++
      }
  })
  .catch((err) => ("Error occured", err));
}