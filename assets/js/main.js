function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    value.topics = data.getAll("topics");

    // Mostramos los datos
    console.log({ value });
    document.getElementById("muestraDatos").innerHTML = "El titulo es: " + value.title;
}

const form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);