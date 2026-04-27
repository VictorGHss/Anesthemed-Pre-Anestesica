document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUrl();
    definirData();

    const btnShare = document.getElementById('btn-share') as HTMLButtonElement;
    const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
    const btnPrint = document.getElementById('btn-print') as HTMLButtonElement;

    btnShare?.addEventListener('click', gerarLinkCompartilhamento);
    btnClear?.addEventListener('click', limparFormulario);
    btnPrint?.addEventListener('click', imprimirAval);
});

function definirData(): void {
    const dataInput = document.getElementById('data_avaliacao') as HTMLInputElement;
    if (dataInput && !dataInput.value) {
        dataInput.value = new Date().toLocaleDateString('pt-BR');
    }
}

function limparFormulario(): void {
    if (confirm("Limpar todos os campos?")) {
        const form = document.getElementById("avaliacao-form") as HTMLFormElement;
        form.reset();
        definirData();
        // Limpa a URL atual removendo os parâmetros de busca
        window.history.pushState({}, document.title, window.location.pathname);
    }
}

function gerarLinkCompartilhamento(): void {
    const form = document.getElementById('avaliacao-form') as HTMLFormElement;
    const nomeInput = document.getElementById('nome_paciente') as HTMLInputElement;
    
    if (!nomeInput || !nomeInput.value.trim()) {
        alert("Preencha ao menos o nome do paciente!");
        return;
    }

    // Coleta TODOS os campos que possuem a tag 'name'
    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    formData.forEach((value, key) => {
        // Ignora valores vazios para não poluir o link
        if (value.toString().trim() !== "") {
            params.append(key, value.toString());
        }
    });

    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?${params.toString()}`;
    
    const msg = `📋 *AVALIAÇÃO PRÉ-ANESTÉSICA*\n👤 PACIENTE: ${nomeInput.value.toUpperCase()}\n🔗 LINK: ${link}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(msg).then(() => alert("Link copiado para a área de transferência!"));
    } else {
        prompt("Copie o texto abaixo:", msg);
    }
}

function carregarDadosUrl(): void {
    const params = new URLSearchParams(window.location.search);
    const form = document.getElementById('avaliacao-form') as HTMLFormElement;

    if (!form) return;

    params.forEach((value, key) => {
        // Encontra os inputs pelo 'name' da URL
        const elements = form.querySelectorAll(`[name="${key}"]`);
        
        elements.forEach(element => {
            const el = element as HTMLInputElement;
            if (el.type === 'radio' || el.type === 'checkbox') {
                if (el.value === value) {
                    el.checked = true;
                }
            } else {
                el.value = value;
            }
        });
    });
}

function imprimirAval(): void {
    const nomeInput = document.getElementById('nome_paciente') as HTMLInputElement;
    const n = nomeInput?.value.trim() || "PACIENTE";
    document.title = "AVAL_" + n.replace(/\s+/g, '_').toUpperCase();
    window.print();
}