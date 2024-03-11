window.addEventListener('load', function () {

    let viejaContraseña = document.querySelector('.contraseña-vieja');
    let nuevaContraseña = document.querySelector('.nueva-contraseña');
    let repetirContraseña = document.querySelector('.repetir-contraseña');

    let viejaContraseñaMsg = document.querySelector('.contraseña-vieja-msg');
    let nuevaContraseñaMsg = document.querySelector('.contraseña-nueva-msg')
    let repetirContraseñaMsg = document.querySelector('.repetir-contraseña-msg');

    viejaContraseña.addEventListener('blur', function () {
        if (viejaContraseña.value === '') {
            viejaContraseña.style.border = '2px solid red';
            viejaContraseñaMsg.style.display = 'block';
            viejaContraseñaMsg.textContent = 'Ingresa tu actual contraseña';
        } else if (viejaContraseña.value.length < 8) {
            viejaContraseña.style.border = '2px solid red';
            viejaContraseñaMsg.textContent = 'Debe contener al menos 8 caracteres';
        } else {
            viejaContraseña.style.border = '2px solid green';
            viejaContraseñaMsg.style.display = 'none'
        }
    });

    viejaContraseña.addEventListener('input', function () {
        if (viejaContraseña.value === '') {
            viejaContraseña.style.border = '2px solid red';
            viejaContraseñaMsg.style.display = 'block';
            viejaContraseñaMsg.textContent = 'Ingresa tu actual contraseña';
        } else if (viejaContraseña.value.length < 8) {
            viejaContraseña.style.border = '2px solid red';
            viejaContraseñaMsg.textContent = 'Debe contener al menos 8 caracteres';
        } else {
            viejaContraseña.style.border = '2px solid green';
            viejaContraseñaMsg.style.display = 'none'
        }
    });

    nuevaContraseña.addEventListener('blur', function () {
        let regexMayuscula = /[A-Z]/;
        let regexMinuscula = /[a-z]/;
        let regexNumero = /[0-9]/;
        let regexCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        if (nuevaContraseña.value === '') {
            nuevaContraseña.style.border = '2px solid red';
            nuevaContraseñaMsg.textContent = 'Ingrese la nueva contraseña';
            nuevaContraseñaMsg.style.display = 'block';
        } else if (nuevaContraseña.value.length < 8) {
            nuevaContraseña.style.border = '2px solid red';
            nuevaContraseñaMsg.textContent = 'La contraseña debe contener al menos 8 caracteres';
            nuevaContraseñaMsg.style.display = 'block';
        } else if (!regexMayuscula.test(nuevaContraseña.value) ||
            !regexMinuscula.test(nuevaContraseña.value) ||
            !regexNumero.test(nuevaContraseña.value) ||
            !regexCaracterEspecial.test(nuevaContraseña.value)) {
            nuevaContraseña.style.border = '2px solid red';
            nuevaContraseñaMsg.textContent = 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un caracter especial';
            nuevaContraseñaMsg.style.display = 'block';
        } else {
            nuevaContraseña.style.border = '2px solid green';
            nuevaContraseñaMsg.style.display = 'none';
        }
    });

    nuevaContraseña.addEventListener('input', function () {
        let regexMayuscula = /[A-Z]/;
        let regexMinuscula = /[a-z]/;
        let regexNumero = /[0-9]/;
        let regexCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        if (nuevaContraseña.value === '') {
            nuevaContraseña.style.border = '2px solid red';
            nuevaContraseñaMsg.textContent = 'La contraseña no puede estar vacía';
            nuevaContraseñaMsg.style.display = 'block';
        } else if (nuevaContraseña.value.length < 8) {
            nuevaContraseña.style.border = '2px solid red';
            nuevaContraseñaMsg.textContent = 'La contraseña debe contener al menos 8 caracteres';
            nuevaContraseñaMsg.style.display = 'block';
        } else if (!regexMayuscula.test(nuevaContraseña.value) ||
            !regexMinuscula.test(nuevaContraseña.value) ||
            !regexNumero.test(nuevaContraseña.value) ||
            !regexCaracterEspecial.test(nuevaContraseña.value)) {
            nuevaContraseña.style.border = '2px solid red';
            nuevaContraseñaMsg.textContent = 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un caracter especial';
            nuevaContraseñaMsg.style.display = 'block';
        } else {
            nuevaContraseña.style.border = '2px solid green';
            nuevaContraseñaMsg.style.display = 'none';
        }
    });




    repetirContraseña.addEventListener('blur', function () {
        if (repetirContraseña.value === '') {
            repetirContraseña.style.border = '2px solid red';
            repetirContraseñaMsg.style.display = 'block';
            repetirContraseñaMsg.textContent = 'Repite la contraseña';
        } else if (repetirContraseña.value !== nuevaContraseña.value) {
            repetirContraseña.style.border = '2px solid red';
            repetirContraseñaMsg.style.display = 'block';
            repetirContraseñaMsg.textContent = 'Las contraseñas no coinciden';

        } else {
            repetirContraseña.style.border = '2px solid green';
            repetirContraseñaMsg.style.display = 'none'
        }

    });

    repetirContraseña.addEventListener('input', function () {
        if (repetirContraseña.value === '') {
            repetirContraseña.style.border = '2px solid red';
            repetirContraseñaMsg.style.display = 'block';
            repetirContraseñaMsg.textContent = 'Repite la contraseña';
        } else if (repetirContraseña.value !== nuevaContraseña.value) {
            repetirContraseña.style.border = '2px solid red';
            repetirContraseñaMsg.textContent = 'Las contraseñas no coinciden';
        } else {
            repetirContraseña.style.border = '2px solid green';
            repetirContraseñaMsg.style.display = 'none'
        }
    });



});


