function generateXML() {
    const cnpj = document.getElementById("cnpj").value;
    const dataEmissao = document.getElementById("dataemissao").value;
    let valor = document.getElementById("valor").value.replace(',', '.'); 
    const numDoc = document.getElementById("numdoc").value;
    const uf = document.getElementById("uf").value;

    /* IMPOSTOS */
    const pis = document.getElementById("pis").value.replace(',', '.'); 
    const cofins = document.getElementById("cofins").value.replace(',', '.'); 
    const ir = document.getElementById("ir").value.replace(',', '.'); 
    const csll = document.getElementById("csll").value.replace(',', '.'); 
    const iss = document.getElementById("iss").value.replace(',', '.'); 
    const inss = document.getElementById("inss").value.replace(',', '.'); 

    if (cnpj.trim() == "") {
        flashMessage("warning", "Por favor informe um CNPJ");
    } else if (dataEmissao.trim() == "") {
        flashMessage("warning", "Por favor informe uma data de emissão");
    } else if (valor.trim() == "") {
        flashMessage("warning", "Por favor informe um valor");
    } else if (numDoc.trim() == "") {
        flashMessage("warning", "Por favor informe o número do documento");
    } else if (uf.trim() == "") {
        flashMessage("warning", "Por favor informe o UF");
    } else {
        fetch('layout.xml')
            .then(response => response.text())
            .then(xmlContent => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

                // CNPJ
                const cnpjTag = xmlDoc.querySelector('IdentificacaoPrestador > Cnpj');
                cnpjTag.textContent = cnpj;

                // Data Emissão
                const competenciaTag = xmlDoc.querySelector('Competencia');
                competenciaTag.textContent = dataEmissao + "T00:00:00";
                const dataEmissaoTag = xmlDoc.querySelector('DataEmissao');
                dataEmissaoTag.textContent = dataEmissao + "T00:00:00";

                // Valor
                const valorServicoTag = xmlDoc.querySelector('Valores > ValorServicos');
                valorServicoTag.textContent = valor.replace('.', ','); 
                const baseCalculoTag = xmlDoc.querySelector('Valores > BaseCalculo');
                baseCalculoTag.textContent = valor.replace('.', ','); 

                // Número Documento
                const numeroTag = xmlDoc.querySelector('Numero');
                numeroTag.textContent = numDoc;

                // UF
                const ufTag = xmlDoc.querySelector('OrgaoGerador > Uf');
                const ufTag2 = xmlDoc.querySelector('PrestadorServico > Endereco > Uf');
                ufTag.textContent = uf;
                ufTag2.textContent = uf;

                // Impostos
                let valorNum = parseFloat(valor);

                if (pis.trim() !== "") {
                    const pisTag = xmlDoc.querySelector('Valores > ValorPis');
                    pisTag.textContent = pis.replace('.', ','); 
                    valorNum -= parseFloat(pis);
                }

                if (cofins.trim() !== "") {
                    const cofinsTag = xmlDoc.querySelector('Valores > ValorCofins');
                    cofinsTag.textContent = cofins.replace('.', ','); 
                    valorNum -= parseFloat(cofins);
                }

                if (ir.trim() !== "") {
                    const irTag = xmlDoc.querySelector('Valores > ValorIr');
                    irTag.textContent = ir.replace('.', ','); 
                    valorNum -= parseFloat(ir);
                }

                if (csll.trim() !== "") {
                    const csllTag = xmlDoc.querySelector('Valores > ValorCsll');
                    csllTag.textContent = csll.replace('.', ','); 
                    valorNum -= parseFloat(csll);
                }

                if (iss.trim() !== "") {
                    const issTag = xmlDoc.querySelector('Valores > ValorIss');
                    issTag.textContent = iss.replace('.', ','); 
                    valorNum -= parseFloat(iss);
                }

                if (inss.trim() !== "") {
                    const inssTag = xmlDoc.querySelector('Valores > ValorInss');
                    inssTag.textContent = inss.replace('.', ','); 
                    valorNum -= parseFloat(inss);
                }

                // Valor Líquido
                const valorLiquidoTag = xmlDoc.querySelector('Valores > ValorLiquidoNfse');
                valorLiquidoTag.textContent = valorNum.toFixed(2).replace('.', ','); 
                flashMessage("success", "Gerando arquivo XML");

                const updatedXmlContent = new XMLSerializer().serializeToString(xmlDoc);
                const blob = new Blob([updatedXmlContent], { type: 'text/xml' });

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = numDoc + '.xml';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                flashMessage("error", "Erro gerando arquivo XML");
                console.log(error);
            });
    }
}

function showImage(inputId, cidade) {
    const imagensDiv = document.getElementById('imagens')
    imagensDiv.classList.add('imagenshow')
    imagensDiv.innerHTML = ''

    const img = document.createElement('img')
    img.src = `Imagens/Notas/${cidade}/${inputId}.png`
    img.alt = `${cidade} - ${inputId}`

    imagensDiv.appendChild(img)
}

document.addEventListener('DOMContentLoaded', () => {
    const numericFields = ['pis', 'cofins', 'ir', 'csll', 'iss', 'inss', 'valor']
    numericFields.forEach(fieldId => {
        const field = document.getElementById(fieldId)
        field.addEventListener('input', () => validateInput(field))
        field.addEventListener('keypress', isNumberKey)
    });

    const inputFields = document.querySelectorAll('input')
    const cidadeSelect = document.getElementById('cidade')

    inputFields.forEach(input => {
        input.addEventListener('click', function() {
            //console.log(`Input field with ID '${input.id}' was clicked. Selected town: ${cidadeSelect.value}`)
            showImage(input.id, cidadeSelect.value)
        });
    });
});

function isNumberKey(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    const input = evt.target;
    const value = input.value;

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 44) {
        return false;
    }

    if (charCode === 44 && value.includes(',')) {
        return false;
    }

    return true;
}

function validateInput(input) {
    let value = input.value;
    
    input.value = value.replace(/[^0-9,]/g, '');

    const parts = input.value.split(',');
    if (parts.length > 2) {
        input.value = parts[0] + ',' + parts.slice(1).join('');
    }
}

function flashMessage(type, message) {
    const messageElement = document.getElementById("message")
    messageElement.classList.add(type)
    messageElement.innerHTML = message
    setTimeout(() => {
        messageElement.innerHTML = ""
        messageElement.classList.remove(type)
    }, 3000)
}

function handleKeyPress(event, buttonId) {
    if (event.key === 'Enter') {
        event.preventDefault()
        document.getElementById(buttonId).click()
    }
}

