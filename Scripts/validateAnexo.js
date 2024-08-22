var msgValidacao = "";
var msgErro = "";

function validateAnexo() {

    msgValidacao = "";
    msgErro = "";

    var fileType = 'text/xml'
    //if (file.includes()) {

    //}

    let date = $('#Emissao').val()    
    var d = new Date(date + 'T00:00:00');
    var dateFormat1 = (d.getDate().toString().length == 1 ? "0" + d.getDate() : d.getDate()) + '[-|\\/]' + ((d.getMonth() + 1).toString().length == 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + '[-|\\/]' + d.getFullYear();
    var dateFormat2 = d.getFullYear() + '[-|\\/]' + ((d.getMonth() + 1).toString().length == 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + '[-|\\/]' + (d.getDate().toString().length == 1 ? "0" + d.getDate() : d.getDate())
    var periodo = ((d.getMonth() + 1).toString().length == 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + '[-|\\/]' + d.getFullYear();
    var periodo2 = d.getFullYear() + '[-|\\/]' + ((d.getMonth() + 1).toString().length == 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1));


    var inputNumNota = $('#Nota_numero').val().replace(/[^\d]/g, '');
    var auxLength0 = 15 - (4 + inputNumNota.slice(4).length)
    
    try {
        //let xml = atob(xmlFile.file.replace('data:' + fileType + ';base64,', ''));
        //const xmlreg = new RegExp("^<.*?>");
        //validateXML = false
        //try {
        //    xmlDoc = $.parseXML(xml)
        //    validateXML = true
        //} catch (e) {
        //    //if (xml.toLowerCase().includes('<?xml version=')) 
        //    if (xmlreg.test(xml)) 
        //    {
        //        validateXML = true
        //    }
        //}
        let fileString = atob(xmlFile.file.replace('data:' + xmlFile.type + ';base64,', ''));
        fileString = fileString.replaceAll('ns3:', '').replaceAll('ns4:', '').replaceAll('ns2:', '').replaceAll('ns1:', '').replace('default:', '').replace('ii:', '').replace('tc:', '').replace('issweb:', '')
        let xml = fileString//xmlFile.type == "text/plain" ? convertTXT(fileString) : fileString;
		xml = xml.replace(xml.substring(0, xml.indexOf("<")), '')
        const xmlregInit = new RegExp("<","g"); // Adicione a flag "g" para correspondência global
        const xmlregEnd = new RegExp(">","g"); // Adicione a flag "g" para correspondência global
        validateXML = false
        try {
            xmlDoc = $.parseXML(xml)
            validateXML = true
        } catch (e) {
            let matchesInit = xml.match(xmlregInit); // Use o método match()
            let countInit = matchesInit ? matchesInit.length : 0; // Se houver correspondências, obtenha o comprimento do array
            console.log("Número de correspondências inicio: ", countInit); // Imprima o número de correspondências

            let matchesEnd = xml.match(xmlregEnd); // Use o método match()
            let countEnd = matchesEnd ? matchesEnd.length : 0; // Se
            console.log("Número de correspondências final: ", countEnd);
            if (countInit >=5 && countEnd >=5) {
                validateXML = true
            }
			
			
        }

        if (xml.includes("Skia/PDF") ||
            xml.includes("LibreOffice") ||
            xml.includes("office:document") ||
            xml.includes("PolyLine") ||
            xml.includes("tcSubstituicaoNfse")) {
            msgErro = 'O arquivo XML não foi identificado como válido, mas sim um PDF convertido!'
            return false;
        }

        if (xml.includes("Excel.Sheet")) {
            msgErro = 'O arquivo XML não foi identificado como válido, mas sim um Exceel convertido!'
            return false;
        }

        if (!validateXML) {
            msgErro = 'O arquivo XML não foi identificado como válido!'
            return false;
        }



        const cnpjPrestador = new RegExp($('#Cnpj').val().replace(/^0+/, '')); //CNPJ do prestador q tu recebeu tem q ter o mesmo radical do q veio na nota
        const cnpjPrestador2 = new RegExp($('#Cnpj').val().replace('.', '').replace('/', '').replace('-', '').replace(/^0+/, ''));
        const cnpjPrestador3 = new RegExp($('#Cnpj').val().replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").replace(/^0+/, ''));
        const cnpjPrestador4 = new RegExp($('#Cnpj').val());

        const cnpjTomador = new RegExp('92.?685.?833'); //CNPJ do tomador tem q ter o mesmo radical do q o q veio na nota, obrigatoriamente sendo do HMV

        if ($('#Nota_valor').val().replace(/[^\d]/g, '') === "") {
            msgErro = "Erro ao validar valor da nota inserido"
            $('#VALOR_PAGAMENTO').notify("Valor da nota não está preenchida corretamente", 'warn');
            return false;
        }

        const valor1 = new RegExp('(<)?(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos).{1,30}?' + $('#Nota_valor').val() + '.{1,30}(<\/)?(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos)'); //valor deve ser igual ao q foi informado
        const valor2 = new RegExp('>' + $('#Nota_valor').val().replace(/[^\d]/g, '') + '<');
        const valor3 = new RegExp('>' + $('#Nota_valor').val().replace(/[^\d]/g, '').slice(0, -2) + '<');
        const valor4 = new RegExp('>' + $('#Nota_valor').val().replace(/[^\d]/g, '').slice(0, -1) + '<');

        //const valor = new RegExp(dto.nota_valor); //valor deve ser igual ao q foi informado

        const numNota = new RegExp(inputNumNota); //numero da nota deve ser o mesmo do informado na nota, podendo ter a variacao dos zeros(9)

        var aux = inputNumNota.substring(4);        
        const numNota2 = new RegExp(inputNumNota.slice(0, 4) + aux.replace(/^0+/, ''));
        const numNota3 = new RegExp(inputNumNota.slice(0, 4) + '0'.repeat(auxLength0) + inputNumNota.slice(4));

        const emissao = new RegExp('(Emissao|emissao|Emi|EMISSAO|data).{1,10}' + dateFormat1); //emissão deve ser igual ao que foi digitado
        const emissao2 = new RegExp('(Emissao|emissao|Emi|EMISSAO|data).{1,10}' + dateFormat2);
        const emissao3_Valor = new RegExp('(Emissao|emissao|Emi|EMISSAO|data).{1,10}(\\d+[-|\\/]\\d+[-|\\/]\\d+)');
        const emissao4 = new RegExp('(Emissao|emissao|Emi|EMISSAO|data).{1,10}(\\d+)');


        

        const competencia = new RegExp('(Compet|compet).{1,10}' + periodo); //competencia tem q ser do mesmo mes/ano do mesano da emissao
        const competencia2 = new RegExp('(Compet|compet).{1,10}' + periodo2);
        const competencia3_Valor = new RegExp('(Compet|compet).{1,10}(\\d+[-|\\/]\\d+)');



        debugger;

		cnpjP = (cnpjPrestador.test(xml) || cnpjPrestador2.test(xml) || cnpjPrestador3.test(xml) || cnpjPrestador4.test(xml))


        if (!cnpjP) {
            msgErro = "CNPJ do prestador não identificado no Arquivo"
            return false;
        }

        cnpjT = (cnpjTomador.test(xml))

        if (!cnpjT) {
            msgErro = "A Nota inserida não pertence Hospital Moinhos de Vento"
            return false;
        }

        v = valor1.test(xml)
        v2 = false, v3 = false, v6 = false, v4 = false, v5 = false, v7 = false
        var validateValue = xml.match('<?(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos)(.*?)</(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos)');
        if (validateValue != null) {
            validateValue2 = validateValue[2].replace(/[^\d,.]/g, '')

            v2 = valor2.test(xml.match('<?(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos).*</(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos)')[0].replace(/[^\d<>]/g, ''))
            if (validateValue2.match('[,\.]\\d{2}$') == null || validateValue2.match('[,\.]\\d{1}$') == null) {
                v3 = valor3.test(xml.match('<?(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos).*</(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos)')[0].replace(/[^\d<>]/g, ''))
                //v5 = valor3.test(xml.replace(/[^\d<>]/g, ''))
            
                v6 = valor4.test(xml.match('<?(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos).*</(ValorServicos|Valor|valor|total|vTPrest|valorServicos|VL_SERVICO|VALOR_SERVICO|vtNF|valorBruto|valorTot|alServicos|vServ|vPag|ValorTotalNota|vRec|valor_nf|envl_servicos)')[0].replace(/[^\d<>]/g, ''))
                //v7 = valor4.test(xml.replace(/[^\d<>]/g, ''))

            }
        }        
        //v4 = valor2.test(xml.replace(/[^\d<>]/g, ''))


        valor = (v || v2 || v3 || v4 || v5 || v6 || v7)
        if (!valor) {
            msgErro = "O valor emitido e o valor solicitado não correspondem"
            return false;
        }

        nota = (numNota.test(xml) || numNota2.test(xml) || numNota3.test(xml))
        if (!nota) {
            msgErro = "Número da nota do formulário e diferente do número da nota no XML."
            return false;
        }

        emiss = (emissao.test(xml) || emissao2.test(xml))
        if (emissao3_Valor.test(xml) && !emiss) {
            emissData = xml.match('(Emissao|emissao|Emi|data).{1,5}(\\d+[-|\\/]\\d+[-|\\/]\\d+)')[2]
            if (!new RegExp(dateFormat1).test(emissData) && !new RegExp(dateFormat2).test(emissData)) {
                msgErro = "A data de emissão informado não bate com o presente no XML"
                return false;
            }
        }
		
        if (!emissao4.test(xml) && xmlFile.type == "text/plain") {
            msgErro = "A data de emissão informado não bate com o presente no TXT"
            return false;
        }

        if (!emiss) {
            msgErro = "A data de emissão informado não bate com o presente no XML"
            return false;
        }

        comp = (competencia.test(xml) || competencia2.test(xml))
        if (dto.excessao != true) {
            
            if (competencia3_Valor.test(xml) && !comp) {
                competData = xml.match('(Compet|compet).{1,6}(\\d+[-|\\/]\\d+)')
                if (competData.length >= 2) {
                    if (!new RegExp(periodo).test(competData[2]) && !new RegExp(periodo2).test(competData[2])) {
                        msgErro = "A Data de competência do Arquivo não é do mês atual"
                        return false;
                    }
                }
            }
        }
        
        if (!periodo) {
            msgErro = "A Data de competência do Arquivo não é do mês atual"
            return false;
        }
        
        msgValidacao = "Os sequintes valores não foram identificados: "
                             
        if (!cnpjP) {
            PresstadorCNPJ_Valid = false
            PresstadorCNPJText_Valid = "O CNPJ do Prestador não foi identificado"
        } else {
            PresstadorCNPJ_Valid = true
            PresstadorCNPJText_Valid = "O CNPJ do Prestador foi validado com sucesso"
        }           
        if (!cnpjT) {
            TomadorCNPJText_Valid = "O CNPJ do Tomador não foi identificado"
            TomadorCNPJ_Valid = false
        } else {
            TomadorCNPJText_Valid = "O CNPJ do Tomador foi validado com sucesso"
            TomadorCNPJ_Valid = true
        }   
        if (!valor) {
            ValorNotaText_Valid = "Valor da Nota não foi identificado"
            ValorNota_Valid = false
        } else {
            ValorNotaText_Valid = "Valor da Nota foi identificado com sucesso"
            ValorNota_Valid = true
        }   
        if (!nota) {
            NumeroNotaText_Valid = "O Número da Nota não foi identificado"
            NumeroNota_Valid = false
        } else {
            NumeroNotaText_Valid = "O Número da Nota foi identificado com sucesso"
            NumeroNota_Valid = true
        }   
        if (!emiss) {
            EmissaoNota_Valid = false
            EmissaoNotaText_Valid = "A Data de Emissão não foi identificado"
        } else {
            EmissaoNotaText_Valid = "A Data de Emissão foi identificado com sucesso"
            EmissaoNota_Valid = true
        }   
        if (!comp) {
            CompetenciaNotaText_Valid = "A Competência não foi identificado"
            CompetenciaNota_Valid = false
        } else {
            CompetenciaNotaText_Valid = "A Competência foi identificado com sucesso"
            CompetenciaNota_Valid = true
        }           

        if (cnpjP && cnpjT && valor && nota && emiss && comp) {
            msgValidacao = "Todos os valores validados foram identificados"
        }
        else {
            msgValidacao += "\n\n" + PresstadorCNPJText_Valid
                + "\n" + TomadorCNPJText_Valid
                + "\n" + ValorNotaText_Valid
                + "\n" + NumeroNotaText_Valid
                + "\n" + EmissaoNotaText_Valid
                + "\n" + CompetenciaNotaText_Valid
        }

        return true;

        

    } catch (error) {
        console.log(error)
    }

}