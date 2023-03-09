const nameElement = document.querySelector('.person-name');
const nameFooterElement = document.querySelector('.footer-person-name');
const countryElement = document.querySelector('.person-country');
const emailElement = document.querySelector('.email');
const wppNumber = document.querySelector('.whatsappLink');
const imageElement = document.querySelector('.profile-image-user');

const sendBtn = document.querySelector('#btn-send');
const copyBtn = document.querySelector('#btn-copy');
const btnUp = document.querySelector('.up');

const form = document.querySelector('#form');
const inputImage = document.querySelector('#input-img');
const btnReset = document.querySelector('#resetForm');


//Creo la data del usuario con la API: 'randomuser'
//Obtenemos datos de: , name, surname, email, location, phone number, picture.
const url = 'https://randomuser.me/api/?inc=name,email,location,phone,picture';

function init() {

    //Si existe algo en el localStorage con key = "name" -> randeriza los datos del localStorage
    //Sino llama a la Api y randeriza datos de personas random
    if (localStorage.getItem('name')) {

        nameElement.innerHTML = `${localStorage.getItem('name')} ${localStorage.getItem('surname')}`;
        nameFooterElement.innerHTML = `${localStorage.getItem('name')} ${localStorage.getItem('surname')}`;
        countryElement.innerHTML = localStorage.getItem('country');
        emailElement.innerHTML = localStorage.getItem('email');
        wppNumber.setAttribute('href', `https://api.whatsapp.com/send?phone=${localStorage.getItem('phone')}`);
        imageElement.src = localStorage.getItem('image');
    } else {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const results = data.results[0];

                nameElement.innerHTML = `${results.name.first} ${results.name.last}`;
                nameFooterElement.innerHTML = `${results.name.first} ${results.name.last}`;

                countryElement.innerHTML = `${results.location.country}`;

                emailElement.innerHTML = `${results.email}`;
                wppNumber.setAttribute('href', `https://api.whatsapp.com/send?phone=${cleanNumber(results.phone)}`);

                imageElement.src = `${results.picture.large}`;
            });
    }
};
init();

//Verifico que el numero de telefono solo contenga numeros.
function cleanNumber(number) {
    //Elemina todos los parentesis de apertura y cierre, espacios y guiones medios 
    return number.replace(/\(|\)?-|\s|\)/g, "");
}

//Se envia un email a 'zuccarelo1@gmail.com' con el texto introducido en el textArea de sweetAlert
sendBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    //Sweet alert recibe un mensaje para enviar (value)
    const { value } = await Swal.fire({
        title: 'Enviame un email!',
        inputLabel: 'Escribe aqui tu mensaje',
        input: 'textarea',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        inputValidator: (message) => {
            if (!message) {
                return 'You need to write something!'
            }
        }
    })
    if (value) {
        window.location.href = `mailto:zuccarelo1@gmail.com?Subject=Message%20portfolio%20arg-programa&body=${value}`;
    };
})

/* Form utilizando formData*/
form.addEventListener('submit', (event) => {
    //no recarga la pagina
    event.preventDefault();

    //Toma la img que cargo el usuario y la pone como foto de perfil.
    getAndRenderImage();

    const formData = new FormData(form);
    nameElement.innerHTML = `${formData.get('name')} ${formData.get('surname')}`;
    nameFooterElement.innerHTML = `${formData.get('name')} ${formData.get('surname')}`;
    countryElement.innerHTML = formData.get('country');
    emailElement.innerHTML = formData.get('email');
    wppNumber.setAttribute('href', `https://api.whatsapp.com/send?phone=${formData.get('phone')}`);

    //Guardo en localStorage
    localStorage.setItem('name', `${formData.get('name')}`);
    localStorage.setItem('surname', `${formData.get('surname')}`);
    localStorage.setItem('email', `${formData.get('email')}`);
    localStorage.setItem('country', `${formData.get('country')}`);
    localStorage.setItem('phone', `${formData.get('phone')}`);
})

//Boton reset
btnReset.addEventListener('click', (event) => {
    event.preventDefault();
    form.reset();
    localStorage.clear();
    init();
})

//Si el usuario carga una imagen la guarda en localStorage y la randeriza.
//Si no deja la imagen por defoult de la api
function getAndRenderImage() {
    if (!inputImage.files[0]) {
        return
    }
    let file = inputImage.files[0];
    let fr = new FileReader();

    fr.addEventListener('load', () => {
        localStorage.setItem('image', fr.result)
    });

    fr.readAsDataURL(file);
    fr.onload = function () {
        imageElement.src = this.result;
    }
}

//Subir en la pantalla
btnUp.addEventListener('click', () => {
    window.scrollTo(0, 0);
})

//Boton para copiarel email
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailElement.innerHTML);
})