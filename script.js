const form = document.getElementById("formCadastro");

const objectsGrid = document.getElementById("objectsGrid");

const filters = document.querySelectorAll(".filter");

let objects = JSON.parse(
    localStorage.getItem("cadeMeuObjetos")
) || [];


// CADASTRAR OBJETO

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const objeto = {

        id: Date.now(),

        nome: document.getElementById("nome").value,

        local: document.getElementById("local").value,

        descricao: document.getElementById("descricao").value,

        data: document.getElementById("data").value,

        aluno: document.getElementById("aluno").value,

        contato: document.getElementById("contato").value,

        status: document.getElementById("status").value

    };


    objects.push(objeto);

    localStorage.setItem(
        "cadeMeuObjetos",
        JSON.stringify(objects)
    );


    form.reset();

    renderObjects();

    alert("Objeto cadastrado com sucesso! 💚");

});


// MOSTRAR OBJETOS

function renderObjects(filtro = "Todos") {

    const cadastrados = objects.filter(function (objeto) {

        return filtro === "Todos" ||
               objeto.status === filtro;

    });


    // Mantém os três exemplos se não houver objetos cadastrados

    if (objects.length === 0) {
        updateStats();
        return;
    }


    objectsGrid.innerHTML = "";


    cadastrados.forEach(function (objeto, index) {

        const card = document.createElement("article");

        card.className = "object-card";


        const dataFormatada =
            objeto.data
            ? objeto.data.split("-").reverse().join("/")
            : "";


        const statusClass =
            objeto.status === "Perdido"
            ? "lost"
            : "found";


        const statusTexto =
            objeto.status === "Perdido"
            ? "● PERDIDO"
            : "● ENCONTRADO";


        card.innerHTML = `

            <div class="card-header">

                <span class="status ${statusClass}">
                    ${statusTexto}
                </span>

                <span class="number">
                    #${String(index + 1).padStart(3, "0")}
                </span>

            </div>

            <div class="object-icon">
                📦
            </div>

            <h3>
                ${objeto.nome}
            </h3>

            <p>
                ${objeto.descricao}
            </p>

            <div class="details">

                <div>

                    <span>📍</span>

                    <div>

                        <small>LOCAL</small>

                        <strong>
                            ${objeto.local}
                        </strong>

                    </div>

                </div>


                <div>

                    <span>📅</span>

                    <div>

                        <small>DATA</small>

                        <strong>
                            ${dataFormatada}
                        </strong>

                    </div>

                </div>

                <div>

                    <span>👤</span>

                    <div>

                        <small>ALUNO</small>

                        <strong>
                            ${objeto.aluno}
                        </strong>

                    </div>

                </div>

            </div>


            <button
                class="contact-button"
                onclick="mostrarContato('${objeto.contato}')"
            >
                Ver contato
            </button>

        `;


        objectsGrid.appendChild(card);

    });


    updateStats();

}


// FILTROS

filters.forEach(function (filter) {

    filter.addEventListener("click", function () {

        filters.forEach(function (button) {

            button.classList.remove("active");

        });


        filter.classList.add("active");


        const filtro =
            filter.getAttribute("data-filter");


        renderObjects(filtro);

    });

});


// ESTATÍSTICAS

function updateStats() {

    document.getElementById("totalObjetos").textContent =
        objects.length;

    document.getElementById("totalPerdidos").textContent =
        objects.filter(
            objeto => objeto.status === "Perdido"
        ).length;

    document.getElementById("totalEncontrados").textContent =
        objects.filter(
            objeto => objeto.status === "Encontrado"
        ).length;

}


// CONTATO

function mostrarContato(contato) {

    alert(
        "Entre em contato com o aluno através de:\n\n" +
        contato
    );

}


// PRIMEIRA EXECUÇÃO

updateStats();
