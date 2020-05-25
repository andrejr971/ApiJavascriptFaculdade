var load = document.getElementById('load');
var loadForm = document.getElementById('loadForm');
var results = document.getElementById('results');
var Form = document.getElementById('Form');
var btnClean = document.getElementById('btnClean');

var idInput = document.getElementById('id');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var typeSelect = document.getElementById('type');

const baseURL = 'https://wllsistemas.com.br/api/v2/public/pessoa/';

var peoples = [];
loadPeoples();

function loadPeoples() {
  peoples = [];
  results.innerHTML = '';

  fetch(baseURL)
    .then((res) => res.json())
    .then((res) => {
      res.map((r) => {
        peoples.push(r);
      });
      render();
      endLoad();
      results.style.cssText = 'display: grid';
    })
    .catch((err) => console.log(err));
}

function render() {
  peoples.map((r) => {
    var divCard = document.createElement('div');

    divCard.innerHTML = `<div class="card">
      <div class="card-header">
        <h2>
          ${r.ID} - 
          <strong>${r.NOME}</strong>
        </h2>
        <div>
          <button id="btnEdit-${r.ID}"><i class="far fa-edit"></i></button>
          <button id="btnDelete-${r.ID}"><i class="far fa-trash-alt"></i></button>
        </div>
      </div>
      <div class="card-body">
        <div><strong>E-mail: </strong> ${r.EMAIL} </div>
        <div><strong>tipo: </strong> ${r.TIPO} </div>
      </div>
    </div>`;

    results.appendChild(divCard);

    var btnEdit = document.getElementById(`btnEdit-${r.ID}`);
    btnEdit.addEventListener('click', () => handleShow(r.ID));

    var btnDelete = document.getElementById(`btnDelete-${r.ID}`);
    btnDelete.addEventListener('click', () => handleDelete(r.ID));
  });
}

function handleShow(index) {
  if (idInput.value === '') {
    loadForm.style.cssText = 'display: flex; height: 214px;';
  } else {
    loadForm.style.cssText = 'display: flex; height: 266px;';
  }

  fetch(`${baseURL}${index}`)
    .then((res) => res.json())
    .then((res) => {
      loadForm.style.cssText = 'display: none;';
      idInput.style.cssText = 'display: block';
      idInput.disabled = 'disabled';
      idInput.value = res[0].ID;
      nameInput.value = res[0].NOME;
      emailInput.value = res[0].EMAIL;
      typeSelect.value = res[0].TIPO;
    })
    .catch((err) => {
      console.log(err);
      alert('Ops... Ocorreu um erro, tente novamente');
      idInput.style.cssText = 'display: none';
    });
}

function initLoad() {
  load.style.cssText = 'display: flex';
}

function endLoad() {
  load.style.cssText = 'display: none';
}

function handleDelete(index) {
  if (window.confirm('Deseja excluir o id: ' + index + ' ?')) {
    fetch(`${baseURL}${index}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status === 200) {
          loadPeoples();
          alert('Deletado com sucesso');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Ops... Ocorreu um erro, tente novamente');
      });
  }
}

function clean() {
  idInput.value = '';
  idInput.style.cssText = 'display: none';
  nameInput.value = '';
  emailInput.value = '';
  typeSelect.value = '';
}

btnClean.addEventListener('click', () => clean());

function validateNameInput() {
  if (nameInput.value === '') {
    nameInput.style.cssText = 'border: 1px solid #ff0000';
    return false;
  }

  nameInput.style.cssText = 'border: 1px solid rgba(0, 0, 0, 0.4)';
  return true;
}

function validateEmailInput() {
  if (emailInput.value === '') {
    emailInput.style.cssText = 'border: 1px solid #ff0000';
    return false;
  }
  emailInput.style.cssText = 'border: 1px solid rgba(0, 0, 0, 0.4)';
  return true;
}

function validateTypeSelect() {
  if (typeSelect.value === '') {
    typeSelect.style.cssText = 'border: 1px solid #ff0000';
    return false;
  }
  typeSelect.style.cssText = 'border: 1px solid rgba(0, 0, 0, 0.4)';
  return true;
}

Form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (validateNameInput() && validateEmailInput() && validateTypeSelect()) {
    handleSubmit();
  } else {
    validateNameInput();
    validateEmailInput();
    validateTypeSelect();
  }
});

function handleSubmit() {
  var data = {
    nome: nameInput.value,
    email: emailInput.value,
    tipo: typeSelect.value,
  };

  initLoad();

  if (idInput.value === '') {
    loadForm.style.cssText = 'display: flex; height: 214px;';
    fetch(baseURL, {
      method: 'POST',
      body: `nome=${data.nome}&email=${data.email}&tipo=${data.tipo}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then((res) => {
        if (res.status === 202 || res.status === 200) {
          loadPeoples();
          clean();
        }

        loadForm.style.cssText = 'display: none;';
      })
      .catch((err) => alert('Ops.. Ocorreu um erro'));
  } else {
    loadForm.style.cssText = 'display: flex; height: 266px;';

    data = {
      ...data,
      id: idInput.value,
    };

    fetch(baseURL, {
      method: 'PUT',
      body: `id=${data.id}&nome=${data.nome}&email=${data.email}&tipo=${data.tipo}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then((res) => {
        if (res.status === 202 || res.status === 200) {
          loadPeoples();
          clean();
        }

        loadForm.style.cssText = 'display: none;';
      })
      .catch((err) => alert('Ops.. Ocorreu um erro'));
  }
}
