document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUrl();
    definirData();

    const btnPrint = document.getElementById('btn-print') as HTMLButtonElement;
    const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
    const btnShare = document.getElementById('btn-share') as HTMLButtonElement;

    btnPrint?.addEventListener('click', abrirImpressao);
    btnClear?.addEventListener('click', limparFormulario);
    btnShare?.addEventListener('click', gerarLinkCompartilhamento);

    // Atualiza URL em tempo real para qualquer digitação ou clique
    const form = document.getElementById('avaliacao-form') as HTMLFormElement;
    form?.addEventListener('input', atualizarUrlEmTempoReal);
    form?.addEventListener('change', atualizarUrlEmTempoReal);
});

function atualizarUrlEmTempoReal(): void {
    const form = document.getElementById('avaliacao-form') as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    formData.forEach((value, key) => {
        if (value.toString().trim() !== "") {
            params.append(key, value.toString());
        }
    });

    const baseUrl = window.location.origin + window.location.pathname;
    const newUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    
    window.history.replaceState({}, document.title, newUrl);
}

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
        atualizarUrlEmTempoReal(); 
    }
}

function gerarLinkCompartilhamento(): void {
    atualizarUrlEmTempoReal(); 
    
    const nomeInput = document.getElementById('nome_paciente') as HTMLInputElement;
    const link = window.location.href; 
    const nome = nomeInput?.value.trim() || "PACIENTE";
    
    const msg = `📋 *AVALIAÇÃO PRÉ-ANESTÉSICA*\n👤 PACIENTE: ${nome.toUpperCase()}\n🔗 LINK: ${link}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(msg).then(() => alert("Link copiado para a área de transferência com sucesso!"));
    } else {
        prompt("Copie o texto abaixo:", msg);
    }
}

function carregarDadosUrl(): void {
    const params = new URLSearchParams(window.location.search);
    const form = document.getElementById('avaliacao-form') as HTMLFormElement;

    if (!form) return;

    params.forEach((value, key) => {
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

function abrirImpressao(): void {
    const nomeInput = document.getElementById('nome_paciente') as HTMLInputElement;
    const n = nomeInput?.value.trim() || "PACIENTE";
    
    // Altera o título da página temporariamente para que o arquivo PDF seja salvo com esse nome
    const tituloOriginal = document.title;
    document.title = "AVALIACAO_ANESTESICA_" + n.replace(/\s+/g, '_').toUpperCase();
    
    window.print();
    
    // Restaura o título original após a impressão
    document.title = tituloOriginal;
}