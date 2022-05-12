const form = document.getElementById("form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const title = document.getElementById("title");
    const url = document.getElementById("url");
    const image = document.getElementById("files");
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("url", url.value);
    for(let i =0; i < files.files.length; i++) {
      formData.append("files", files.files[0]);
    }
    fetch("http://127.0.0.1:3000/upload_bookmark", {
        method: 'POST',
        body: formData,
    })
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));
}