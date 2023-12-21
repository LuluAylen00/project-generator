function setCookie(nombre, valor, dias) {
    // Crear una fecha con los días de duración
    var fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
    // Crear la cadena de la cookie con el nombre, el valor y la fecha de expiración
    var cookie = nombre + "=" + valor + "; expires=" + fecha.toUTCString() + "; path=/";
    // Asignar la cookie al documento
    document.cookie = cookie;
  }

function getCookie(nombre) {
    // Crear una variable con el nombre y el signo igual
    var clave = nombre + "=";
    // Obtener todas las cookies del documento y dividirlas por punto y coma
    var cookies = document.cookie.split(";");
    // Recorrer cada cookie
    for (var i = 0; i < cookies.length; i++) {
      // Eliminar los espacios en blanco al inicio y al final de la cookie
      var cookie = cookies[i].trim();
      // Verificar si la cookie empieza con el nombre buscado
      if (cookie.indexOf(clave) == 0) {
        // Devolver el valor de la cookie sin el nombre ni el signo igual
        return cookie.substring(clave.length, cookie.length);
      }
    }
    // Si no se encuentra la cookie, devolver una cadena vacía
    return "";
  }

async function cargarProductos(){
    let data = await fetch('/products');
    let products = await data.json();

    let ul = document.querySelector("ul#products");
    ul.innerHTML = "";

    let createButton = document.createElement("i");
    createButton.setAttribute("class", "fa-solid fa-plus");
    createButton.addEventListener('click', async () => {
        let div = document.createElement("div");
        div.className = 'formulario';

        let inputNombre = document.createElement("input"); // Name, type y id
        div.appendChild(inputNombre);

        let inputPrice = document.createElement("input"); // Name, type y id
        div.appendChild(inputPrice);

        let categoriesData = await fetch("/categories");
        let categories = await categoriesData.json(); 
        let categoriesSelect = document.createElement("select");
        categories.forEach((category)=>{
            let categoryOption = document.createElement("option");
            categoryOption.value = category.id;
            categoryOption.innerHTML = category.name;
            categoriesSelect.appendChild(categoryOption);
        })
        div.appendChild(categoriesSelect);

        categoriesSelect.addEventListener("change", () => {
            console.log(categoriesSelect.value);
        })

        let brandsData = await fetch("/brands");
        let brands = await brandsData.json(); 
        let brandsSelect = document.createElement("select");
        brands.forEach((brand)=>{
            let brandOption = document.createElement("option");
            brandOption.value = brand.id;
            brandOption.innerHTML = brand.name;
            brandsSelect.appendChild(brandOption);
        })
        div.appendChild(brandsSelect);

        let boton = document.createElement("button");
        boton.addEventListener("click", async() => {
            await fetch('/products', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json" // formencode
                },
                body: JSON.stringify({
                    name: inputNombre.value,
                    price: inputPrice.value,
                    category: categoriesSelect.value,
                    brand: brandsSelect.value,
                })
            })
            cargarProductos();
        })
        div.appendChild(boton);
        ul.innerHTML = "";
        ul.appendChild(div);
    })
    ul.appendChild(createButton);

    products.forEach(function(product){
        let li = document.createElement('li');

        let inputImg = document.createElement("input");
        inputImg.setAttribute("name", "image");
        inputImg.setAttribute("type", "file");
        inputImg.style.display = "none";
        inputImg.setAttribute("id", "image-input-"+product.id);
        inputImg.addEventListener("change", async() => {
            let formData = new FormData();
            formData.append("image",inputImg.files[0])

            await fetch('/products/'+product.id, {
                method: "PATCH",
                //headers:{
                //    "Content-Type": "application/json" // formencode
                //},
                body: formData
            })
            cargarProductos();
        })
        li.appendChild(inputImg);

        let labelImg = document.createElement("label");
        labelImg.setAttribute("for", "image-input-"+product.id)
        if (product.image && product.image != "default.png") {
            let img = document.createElement("img")
            img.src = "/img/products/"+product.image;
            labelImg.appendChild(img);
        } else {
            let spanVacio = document.createElement("span");
            spanVacio.innerHTML = "Subir imagen";

            labelImg.appendChild(spanVacio)
        }
        li.appendChild(labelImg);

        // ID
        let spanId = document.createElement('span');
        spanId.innerHTML = product.id;
        li.appendChild(spanId);
        
        // Nombre
        let spanName = document.createElement('span');
        spanName.innerHTML = product.name;
        li.appendChild(spanName);

        // Precio
        let spanPrice = document.createElement('span');
        spanPrice.innerHTML = product.price;
        li.appendChild(spanPrice);

        let correoEnSesion = sessionStorage.getItem("email")
        console.log(correoEnSesion);

        if (correoEnSesion.includes("@pan.com")) {
            // Icono editar
            let iEditar = document.createElement('i');
            iEditar.setAttribute("class", "fa-solid fa-pen");
            iEditar.addEventListener("click", async() => {
                let div = document.createElement("div");
                div.className = 'formulario';

                let inputNombre = document.createElement("input"); // Name, type y id
                inputNombre.value = product.name;
                div.appendChild(inputNombre);

                let inputPrice = document.createElement("input"); // Name, type y id
                inputPrice.value = product.price;
                div.appendChild(inputPrice);

                let boton = document.createElement("button");
                boton.addEventListener("click", async() => {
                    await fetch('/products/'+product.id, {
                        method: "PUT",
                        headers:{
                            "Content-Type": "application/json" // formencode
                        },
                        body: JSON.stringify({
                            name: inputNombre.value,
                            price: inputPrice.value,
                            category: null
                        })
                    })
                    cargarProductos();
                })
                div.appendChild(boton);
                ul.innerHTML = "";
                ul.appendChild(div);
            })
            li.appendChild(iEditar);
            
            // Icono borrar
            let iBorrar = document.createElement('i');
            iBorrar.setAttribute("class", "fa-solid fa-trash");
            iBorrar.addEventListener("click", async() => {
                await fetch('/products/'+product.id, {
                    method: "DELETE"
                })
                cargarProductos();
            })
            li.appendChild(iBorrar);
        }

        ul.appendChild(li);
    })


    return products;
}

function cargarMensajes(mensajes) {
    let chatBox = document.querySelector("ul#chat-box");
    chatBox.innerHTML = "";
    mensajes.forEach((mensaje) => {
        chatBox.innerHTML += `<li>${mensaje.nombre}: ${mensaje.mensaje}</li>`
    })
}

window.addEventListener("load", async()=>{
    let socket = io();

    socket.emit("asdasd", "Holi")

    socket.on("connected-total", (conectados) =>{
        // console.log(conectados);
    })

    socket.on("mensajes", (mensajes)=> {
        cargarMensajes(mensajes);
    })
    let inputName = document.querySelector("input#chat-name");
    let inputMessage = document.querySelector("input#chat-msg");
    let sendButton = document.querySelector("button#send-msg");
    

    sendButton.addEventListener("click", () => {
        if (inputName.value.length > 0 && inputMessage.value.length > 0) {
            inputName.disabled = true;
            socket.emit("nuevo-mensaje",{
                nombre: inputName.value,
                mensaje: inputMessage.value
            })
            inputMessage.value = "";
        }
    })

    let dataSacadaDeLaCookie = getCookie("theme")      
    let body = document.body;
    body.classList.add(dataSacadaDeLaCookie || "asd");

    // Almacenamiento local -> localStorage (window)
    // Almacenamiento en sesión -> sessionStorage (window)
    // let correo = prompt("Escribe tu correo");
    let correo = "asd"
    if (correo) {
        sessionStorage.setItem("email", correo);
        console.log("Correo ingresado: "+sessionStorage.getItem("email"));
    }

    let correoEnSesion = sessionStorage.getItem("email")
    document.querySelector("h2").innerHTML = "Bienvenido "+ (correoEnSesion ? correoEnSesion : "Invitado")

    let products = await cargarProductos();
    // console.log(products);

    document.querySelector("h2").addEventListener("click", ()=>{
        if (dataSacadaDeLaCookie) {
            setCookie("theme","", -1)
        } else {
            setCookie("theme","dark", 10)
        }
    })
    // setCookie("theme","dark", 10)      
    // alert(document.cookie)
    
    // let dataSacadaDeLaCookie = recuperarDeLaCookie("theme");
    // console.log(dataSacadaDeLaCookie);
    
      
    
})