function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    value.topics = data.getAll("topics");

    // Mostramos los datos (simulando varios)
    console.log({ value });

    var show = document.getElementById("muestraDatos");
    for (i = 0; i < 5; i++) {
        show.innerHTML += "<p id='datosSimulados'>El titulo " + i + " es: " + value.title + "<br/>"
        + "La URL " + i + " es: " + value.url + "<br/><p>";
    }
}

const form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);