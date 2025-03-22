const API_URL = "http://localhost:4000/tarefas";

document.getElementById("form-tarefas").addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao }),
    });

    if (res.ok) {
        carregarTarefas();
        document.getElementById("form-tarefas").reset();
    } else {
        // Se algo deu errado, exibe uma mensagem de erro
        alert('Erro ao adicionar tarefa!');
    }
});

async function carregarTarefas() {
    const res = await fetch(API_URL);
    const tarefas = await res.json();

    const lista = document.getElementById("list-tarefas");
    lista.innerHTML = "";

    tarefas.forEach((tarefa) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="${tarefa.concluida ? "completed" : ""}">${tarefa.titulo}</span>
            <p class="task-description">${tarefa.descricao}</p>
            <div class="button-group">
                <button class="concluido-btn" onclick="marcarConcluida(${tarefa.id}, ${!tarefa.concluida})">
                    ${tarefa.concluida ? "Desfazer" : "Concluir"}
                </button>
                <button class="delete-btn" onclick="deletarTarefa(${tarefa.id})">🗑</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

async function marcarConcluida(id, concluida) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concluida }),
    });

    if (res.ok) {
        carregarTarefas();  // Recarregar as tarefas após a alteração
    } else {
        alert('Erro ao marcar como concluída!');
    }
}

async function deletarTarefa(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    
    if (res.ok) {
        carregarTarefas();  // Recarregar as tarefas após a remoção
    } else {
        alert('Erro ao deletar a tarefa!');
    }
}

// Carregar tarefas ao abrir a página
carregarTarefas();
