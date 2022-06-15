const correo = document.getElementById('floatingInput');
const password = document.getElementById('floatingPassword');

const btnLogin = document.querySelector('button[type="submit"]');
const btnSign = document.querySelector('#registrar');
const btnRecovery = document.querySelector('#recuperar');

const form = document.querySelector('form');
const p = document.querySelector('p.my-3');

const KEY_USER = 'usersdata';
let pageCurrent = 'login';
let usersList = [];

// Referencia al LocalStorage
const dataBase = window.localStorage;

// ! LOGIN FORM PAGE EVENT
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  if (pageCurrent == 'login') {

      if (!validarCampos(correo.value, password.value)) {
        alerta('danger', 'Favor completar los campos');
        vaciarCampos();
      } else if (!existeUsuario(correo.value)) {
        alerta('warning', 'El usuario ingresado no está registrado');
        vaciarCampos();
      } else {
        const usuarios = JSON.parse(dataBase.getItem(KEY_USER));
        const usuario = usuarios.find( user => user.email == correo.value);

        if (usuario.email === correo.value && usuario.pass === password.value) {
          alerta('success', `Le damos la bienvenida ${usuario.name}`);
          setTimeout(function() {
            location.href = '../public/home.html';
          }, 1500);
        } else {
          alerta('warning', 'Correo o contraseña son incorrectos');
        }
      }
  } else {
    modificarForm('login');
  }

});

// ! REGISTER FORM PAGE EVENTE
btnSign.addEventListener('click', function (event) {
  event.preventDefault();

  if (pageCurrent == 'registrar') {
    const name = document.querySelector('#floatingName');

    if (!validarCampos(correo.value, password.value) || name.value.length == 0) {
      alerta('danger', 'Favor completar los campos');
      vaciarCampos();
    } else {
      let user = {
        name: name.value,
        email: correo.value,
        pass: password.value,
      };

      registrarUsuario(user);
    }
  } else {
    modificarForm('registrar');
  }

});

// ! RECOVERY FORM PAGE EVENT
btnRecovery.addEventListener('click', function(event) {
  event.preventDefault();

  if (pageCurrent == 'recuperar') {

    if (correo.value == 0) {
      alerta('danger', 'Favor completar el campos');
      vaciarCampos();
    } else {
      if (existeUsuario(correo.value)) {
        alerta('success', 'El restablecimiento ha sido exitoso, revise su bandeja');
        vaciarCampos();
      } else {
        alerta('danger', 'El correo no figura en nuestra base de datos');
        vaciarCampos();
      }
    }

  } else {
    modificarForm('recuperar');
  }
});


// * Functions DATABASE

function registrarUsuario(user) {
  if ( existeUsuario(user.email) ) {
    alerta('warning', 'El usuario ya esta registrado');
    vaciarCampos();
    document.getElementById('floatingName').value = '';
  } else {
    usersList.push(user);
    dataBase.setItem(KEY_USER, JSON.stringify(usersList));
    alerta('success', 'Usuario registrado con éxito');
    vaciarCampos();
    document.getElementById('floatingName').value = '';
  }
}

function existeUsuario(email) {
  const db = existeBD();
  if ( db ) {
    const usuarios = JSON.parse(db.getItem(KEY_USER));
    const usuario = usuarios.find( user => user.email == email);

    return (usuario) ? true: false;
  } else {
    console.error('No existe referencia de localStorage');
  }
}

function existeBD() {
  let claves = Object.keys(dataBase);
  return claves.length > 0 ? dataBase : false;
}


// * Functions LOGIC

function validarCampos(correo, password) {
  return correo.length <= 0 || password.length <= 0 ? false : true;
}

function alerta(color, mensaje) {
  const contenedorAlerta = document.getElementById('alerta');

  let icon = '';
  switch (color) {
    case 'success':
      icon = '#check-circle-fill';
      break;
    case 'warning':
      icon = '#info-fill';
      break;
    case 'danger':
      icon = '#exclamation-triangle-fill';
      break;
  }

  const contenidoAlerta = `
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </symbol>
      <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </symbol>
      <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </symbol>
    </svg>

    <div class="alert alert-${color} d-flex align-items-center justify-content-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href=${icon} /></svg>
      <div>
        ${mensaje}
      </div>
    </div>
  `;

  contenedorAlerta.innerHTML = contenidoAlerta;

  setTimeout(function () { contenedorAlerta.innerHTML = ''; }, 3500);
}

function vaciarCampos() {
  correo.value = '';
  password.value = '';
}

function modificarForm(page) {
  switch (page) {
    case 'login':
      if (pageCurrent != 'login') {
        location.reload();
        pageCurrent = 'login';
      }
      break;
    case 'registrar':
      if (pageCurrent != 'registrar') {
        form.className = 'animate__animated animate__rubberBand';
        document.querySelector('h1').textContent = 'Crea tu cuenta';

        const contenedorName = document.querySelector('#contenedor-name');

        const inputName = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('class', 'form-control');
        inputName.setAttribute('id', 'floatingName');
        inputName.setAttribute('placeholder', 'Nombre')

        const labelName = document.createElement('label');
        labelName.setAttribute('for', 'floatingName');
        labelName.textContent = 'Nombre';

        contenedorName.append(inputName, labelName);

        form.removeChild(btnLogin);
        form.removeChild(btnRecovery);
        form.removeChild(p);

        btnSign.className = 'w-100 btn btn-lg btn-primary';
        form.appendChild(p);
        btnLogin.className = 'w-100 btn btn-lg btn-outline-secondary'
        form.appendChild(btnLogin);
        pageCurrent = 'registrar';
      }
      break;
    case 'recuperar':
      if (pageCurrent != 'recuperar') {
        form.className = 'animate__animated animate__rubberBand';
        document.querySelector('h1').textContent = 'Recupera tu cuenta';

        form.removeChild(document.querySelector('.form-floating.mb-4'));
        document.querySelector('#contenedor-email').classList.add('form-floating', 'mb-4');

        form.removeChild(btnLogin);
        form.removeChild(btnSign);

        p.textContent = 'Ingresa tu correo para restablecer tu contraseña';

        btnRecovery.className = 'w-100 btn btn-lg btn-primary';
        btnRecovery.textContent = 'Restablecer contraseña';

        btnLogin.className = 'mt-4 btn btn-link'
        form.appendChild(btnLogin);

        pageCurrent = 'recuperar';
      }
      break;
  }
}
