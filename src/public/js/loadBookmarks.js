window.addEventListener('load', loadBookmarks)

function loadBookmarks() {
    fetch("../bookmarks/bookmarks.json")
    .then(response => {
        return response.json();
     })
    .then(objBookmarks => {
        var show = document.getElementById("muestraDatos");
        for (var i = 0; i < objBookmarks["numBookmarks"]; i++) {
            show.innerHTML += "<p id='datosSimulados'>El titulo " + i + " es: " + objBookmarks[i].title + "<br/>"
            + "La URL " + i + " es: " + objBookmarks[i].url + "<br/><p>";
        }
    })
    .catch((err) => ("Error occured", err));
}