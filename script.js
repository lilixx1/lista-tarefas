
const campoTarefa = document.getElementById("campoTarefa");
const botaoAdicionar = document.getElementById("botaoAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const contador = document.getElementById("contador");

let tarefasSalvas = [];

try {
    tarefasSalvas = JSON.parse(
        localStorage.getItem("minhasTarefas")
    ) || [];

    if (!Array.isArray(tarefasSalvas)) {
        tarefasSalvas = [];
    }
} catch (erro) {
    tarefasSalvas = [];
}

function salvarTarefas() {
    const tarefas = [];

    listaTarefas.querySelectorAll("li").forEach(function(tarefa) {
        const checkbox = tarefa.querySelector('input[type="checkbox"]');
        const texto = tarefa.querySelector("span");

        tarefas.push({
            texto: texto.textContent,
            concluida: checkbox.checked
        });
    });

    localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
}

function atualizarContador() {
    const tarefas = listaTarefas.querySelectorAll("li");
    let pendentes = 0;

    tarefas.forEach(function(tarefa) {
        const checkbox = tarefa.querySelector('input[type="checkbox"]');

        if (!checkbox.checked) {
            pendentes++;
        }
    });

    contador.textContent = `Tarefas pendentes: ${pendentes}`;
}

function criarTarefa(textoTarefa, concluida = false) {
    const novaTarefa = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = concluida;
    checkbox.setAttribute("aria-label", "Marcar tarefa como concluída");

    const texto = document.createElement("span");
    texto.textContent = textoTarefa;

    function atualizarVisual() {
        if (checkbox.checked) {
            texto.style.textDecoration = "line-through";
            texto.style.opacity = "0.6";
        } else {
            texto.style.textDecoration = "none";
            texto.style.opacity = "1";
        }
    }

    checkbox.addEventListener("change", function() {
        atualizarVisual();
        atualizarContador();
        salvarTarefas();
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.setAttribute("aria-label", "Excluir tarefa");

    botaoExcluir.addEventListener("click", function() {
        novaTarefa.remove();
        atualizarContador();
        salvarTarefas();
    });

    novaTarefa.appendChild(checkbox);
    novaTarefa.appendChild(texto);
    novaTarefa.appendChild(botaoExcluir);

    listaTarefas.appendChild(novaTarefa);

    atualizarVisual();
}

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === "") {
        alert("Digite uma tarefa primeiro! ♡");
        campoTarefa.focus();
        return;
    }

    criarTarefa(textoTarefa);

    campoTarefa.value = "";
    campoTarefa.focus();

    atualizarContador();
    salvarTarefas();
}

botaoAdicionar.addEventListener("click", adicionarTarefa);

campoTarefa.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});

tarefasSalvas.forEach(function(tarefa) {
    if (tarefa && typeof tarefa.texto === "string") {
        criarTarefa(tarefa.texto, Boolean(tarefa.concluida));
    }
});

atualizarContador();
