// Declaração para o html2pdf.js que foi inserido via CDN no index.html
declare const html2pdf: any;

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUrl();
    definirData();

    const btnDownload = document.getElementById('btn-download') as HTMLButtonElement;
    const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
    const btnShare = document.getElementById('btn-share') as HTMLButtonElement;

    btnDownload?.addEventListener('click', baixarPdf);
    btnClear?.addEventListener('click', limparFormulario);
    btnShare?.addEventListener('click', gerarLinkCompartilhamento);

    // EVENTOS PARA ATUALIZAÇÃO DA URL EM TEMPO REAL
    // Agora o médico não precisa mais apertar em "copiar link" se quiser apenas copiar a URL lá de cima.
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
    
    // Substitui a URL atual no navegador sem recarregar a página
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
        atualizarUrlEmTempoReal(); // Limpa a URL ao resetar
    }
}

function gerarLinkCompartilhamento(): void {
    atualizarUrlEmTempoReal(); // Garante que a URL está 100% atualizada
    
    const nomeInput = document.getElementById('nome_paciente') as HTMLInputElement;
    const link = window.location.href; // Pega a URL que já está preenchida
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

function baixarPdf(): void {
    const nomeInput = document.getElementById('nome_paciente') as HTMLInputElement;
    const n = nomeInput?.value.trim() || "PACIENTE";
    const fileName = "AVALIACAO_ANESTESICA_" + n.replace(/\s+/g, '_').toUpperCase();

    const element = document.querySelector('.container') as HTMLElement;
    const btnDownload = document.getElementById('btn-download') as HTMLButtonElement;
    
    const textoOriginal = btnDownload.innerText;
    btnDownload.innerText = "Gerando PDF...";
    btnDownload.disabled = true;

    // Esconde os botões para não saírem na impressão
    const botoes = document.querySelector('.buttons') as HTMLElement;
    botoes.style.display = 'none';

    // Para evitar que inputs de texto com muito conteúdo fiquem cortados,
    // o html2pdf lida bem, mas passamos a qualidade um pouco maior
    const opt = {
        margin:       5,
        filename:     fileName + '.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // Devolve os botões após baixar
        botoes.style.display = 'flex';
        btnDownload.innerText = textoOriginal;
        btnDownload.disabled = false;
    }).catch((err: any) => {
        console.error("Erro ao gerar PDF:", err);
        alert("Ocorreu um erro ao gerar o PDF. Você também pode tentar usar a opção 'Imprimir' do navegador.");
        botoes.style.display = 'flex';
        btnDownload.innerText = textoOriginal;
        btnDownload.disabled = false;
    });
}