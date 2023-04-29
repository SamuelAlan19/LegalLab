function redirecionar(inputs) {
  var filled = true;

  inputs.forEach(function (input) {

    if (input.value === "") {
      filled = false;
    }

  });

  return filled;

}

var inputs = document.querySelectorAll("input");
var icone = document.getElementById("icone");
inputs.forEach(function (input) {

  input.addEventListener("keyup", function () {
    if (checkInputs(inputs)) {
      icone.disabled = false;
    } else {
      icone.disabled = true;
    }
  });
});

function enviaform() {
  document.addEventListener('keypress', function (e) {
    if (e.which == 13) {
      enviaForm();
    }
  }, false);

}

function download(id) {
  var textarea = document.querySelector("textarea#" + id);
  var textareaConteudo = textarea.value;
  var blob = new Blob([textareaConteudo], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);

  var link = document.createElement('a');
  link.href = url;
  link.download = 'Download.txt';
  link.click();
}

function populateList() {

  //quantidadeBuscas é igual a quantidade de buscas encontradas através dos dados captados pela IA

  var quantidadeBuscas = 200;
  const data = []

  data.push(`<table id="thead">
  <th id="jurisprudencia">Jurisprudrência</th>
  <th>Descrição - conteúdo</th>
  <th id="palavra">Palavras - chave</th>
  <th>Download</th>
  </table>`)

  for (var i = 1; i <= quantidadeBuscas; i++) {

    data.push(`<table><tbody><tr><td id="nome">Aborto em caso de risco</td>
    <td><textarea id="${('area' + i)}" rows="3" cols="20" style="resize: none"
    disabled>HABEAS CORPUS. AUTORIZAÇÃO PARA INTERRUPÇÃO DE GRAVIDEZ. ABORTO NECESSÁRIO. NÃO COMPROVAÇÃO DE RISCO DE MORTE À GESTANTE. ABORTO HUMANITÁRIO. ATO INFRACIONAL ANÁLOGO A ESTUPRO DE VULNERÁVEL. OCORRÊNCIA. VÍTIMA MENOR DE QUATORZE ANOS. VIOLÊNCIA PRESUMIDA. VULNERABILIDADE. TEMPO DE GESTAÇÃO AVANÇADO. ORDEM DENEGADA</textarea></td>
    <td id="chave">Mulheres Aborto Risco</td>
    <td ><i onclick="download('area' + ${i})" id="icones" class="fa fa-download"></i></td>
    </tr></tbody></table>`)
  }
  

  const list = document.querySelector('#paginate .list')
  list.innerHTML = data.join("")

  return data
}

const data = populateList()
let perPage = 4

const state = {
  page: 1,
  perPage,
  totalPage: Math.ceil(data.length / perPage),
  maxVisibleButtons: 5
}

const html = {
  get(element) {
    return document.querySelector(element)
  }
}

const controls = {
  next() {
    state.page++

    const lastPage = state.page > state.totalPage
    if (lastPage) {
      state.page--
    }
  },
  prev() {
    state.page--

    if (state.page < 1) {
      state.page++
    }
  },
  goTo(page) {
    if (page < 1) {
      page = 1
    }
    state.page = +page

    if (page > state.totalPage) {
      state.page = state.totalPage
    }
  },
  createListeners() {
    html.get('.first').addEventListener('click', () => {
      controls.goTo(1)
      update()
    })

    html.get('.last').addEventListener('click', () => {
      controls.goTo(state.totalPage)
      update()
    })

    html.get('.next').addEventListener('click', () => {
      controls.next()
      update()
    })

    html.get('.prev').addEventListener('click', () => {
      controls.prev()
      update()
    })
  }
}

const list = {
  create(item) {
    const div = document.createElement('div')
    div.classList.add('item')
    div.innerHTML = item

    html.get('.list').appendChild(div)
  },
  update() {
    html.get('.list').innerHTML = ""

    let page = state.page - 1
    let start = page * state.perPage
    let end = start + state.perPage
    const paginatedItems = data.slice(start, end)

    paginatedItems.forEach(list.create)
  }
}

function update() {
  list.update()
  buttons.update()
}

function init() {
  update()
  controls.createListeners()
}

const buttons = {
  create(number) {
    const button = document.createElement('div')

    button.innerHTML = number;

    if(state.page == number) {
      button.classList.add('active')
    }

    button.addEventListener('click', (event) => {
      const page = event.target.innerText

      controls.goTo(page)
      update()
    })

    html.get('.pagination .numbers').appendChild(button)

  },
  update() {
    html.get('.pagination .numbers').innerHTML = ""
    const { maxLeft, maxRight } = buttons.calculateMaxVisible()
    for (let page = maxLeft; page <= maxRight; page++) {
      buttons.create(page)
    }

  },
  calculateMaxVisible() {
    const { maxVisibleButtons } = state
    let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
    let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))

    if (maxLeft < 1) {
      maxLeft = 1
      maxRight = maxVisibleButtons
    }

    if (maxRight > state.totalPage) {
      maxLeft = state.totalPage - (maxVisibleButtons - 1)
      maxRight = state.totalPage

      if (maxLeft < 1) maxLeft = 1
    }

    return { maxLeft, maxRight }
  }
}

init()