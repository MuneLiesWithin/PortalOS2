let dto = null;
var pdfFile = { file: "", fileName: "" };
var xmlFile = { file: "", fileName: "", type: "" };
var evidFile = { file: "", fileName: "" };
var txtFile = { file: "", fileName: "" };

let MensagemParaOnbase_Valid = ""
let PresstadorCNPJ_Valid = false
let PresstadorCNPJText_Valid = ""
let TomadorCNPJ_Valid = false
let TomadorCNPJText_Valid = ""
let ValorNota_Valid = false
let ValorNotaText_Valid = ""
let NumeroNota_Valid = false
let NumeroNotaText_Valid = ""
let EmissaoNota_Valid = false
let EmissaoNotaText_Valid = ""
let CompetenciaNota_Valid = false
let CompetenciaNotaText_Valid = ""

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

async function getBase64(element) {
    const file = element.files[0];

    if (file !== undefined) {
        if (element.id == 'Nota_pdf' && file.type != "application/pdf") {
            $('#' + element.id).val('')
            $('#' + element.id).notify('O arquivo inserido deve ser um PDF!', "warn")
        } else if (element.id == 'Nota_xml' && (file.type != "text/xml" && file.type != "text/plain")) {
            $('#' + element.id).val('')
            $('#' + element.id).notify('O arquivo inserido deve ser um XML!', "warn")
        } else if (element.id == 'Evidencia' && file.type != "application/pdf") {
            $('#' + element.id).val('')
            $('#' + element.id).notify('O arquivo inserido deve ser um PDF!', "warn")
        }
    }

    try {
        const result = await toBase64(file);

        if (element.id == 'Nota_pdf') {
            pdfFile.file = result
            pdfFile.fileName = file.name
        } else if (element.id == 'Nota_xml' && file.type == "text/xml") {
            xmlFile.file = result
            xmlFile.fileName = file.name
            xmlFile.type = file.type
        } else if (element.id == 'Nota_xml' && file.type == "text/plain") {
            xmlFile.file = btoa(extractData(atob(result.replace('data:' + file.type + ';base64,', ''))))
            xmlFile.fileName = file.name
            xmlFile.type = file.type

            txtFile.file = result
            txtFile.fileName = file.name        
        } else if (element.id == 'Evidencia') {
            evidFile.file = result
            evidFile.fileName = file.name
        }

    } catch (error) {
        $('#' + element.id).notify('Erro ao inserir arquivo, tente novamente!', {
            className: 'error',
            autoHide: false,
        });
        if (element.id == 'Nota_pdf') {
            pdfFile.file = ""
            pdfFile.fileName = ""
        } else if (element.id == 'Nota_xml') {
            xmlFile.file = ""
            xmlFile.fileName = ""			
        } else if (element.id == 'Evidencia') {
            evidFile.file = ""
            evidFile.fileName = ""
        }

        return;
    }
}

$(document).ready(function () {
    var data = window.location.search.replace('?', '')
    getData(data)
});

function sendData() {

    if (validateNota()) { return; }
    // if(validateNota()) { $.notify('Preencha "NOME DO CONTATO', 'warn'); return; }
    if ($('#Emissao').val() == '') { $('#dataEmissao').notify('Preencha "Data de Emissão".', 'warn'); return; } else { if (!validateData()) { return; } }

    if (pdfFile.file == "") { $('#attachment107_container').notify("Documento não preenchido,", 'warn'); return; }
    if (xmlFile.file == "") { $('#attachment108_container').notify("Documento não preenchido,", 'warn'); return; }
    // if(evidFile.file == "") { $('#attachment114_container').notify("Documento não preenchido", 'warn'); return; }
    if ($('#LiberarParaEnvio_input:checked').length == 0) { $('#LiberarParaEnvio_input').notify("Libere para o envio,", 'warn'); return; }

    var notaValidateXML = validateAnexo();
    if (!notaValidateXML) {
        $('#Nota_xml').notify(msgErro, {
            className: 'error',
            autoHide: false,
        });

        return;
    } else {
        MensagemParaOnbase_Valid = msgValidacao
    }


    var nota = window.location.search.replace('?', '')

    $("body").addClass("wait-cursor");
    $("input[name='submit']").prop('disabled', true)
        .removeClass('bold_label')
        .removeClass('button')
        .removeClass('ui-state-default')
        .removeClass('ui-button-label-wrap')
        .removeClass('ui-button');


    $.ajax({
        method: "GET",
        url: config.ValidateNota + '?cnpj=' + $('#Cnpj').val() + '&emissao=' + $('#Emissao').val() + '&numeroNota=' + $('#Nota_numero').val() + '&total=' + $('#Nota_valor').val().replace(',', '%2C'),
        contentType: 'text/plain'
        
    }).done(function (result) {
        if (result != "") {
            $.notify("Erro, nota ja enviada na solicitação " + result + ". Entre em contato com o suporte!", {
                className: 'error',
                autoHide: false,
            });
            $('input[name="submit"]').notify("Erro, nota ja enviada na solicitação " + result + ". Entrar em contato com o suporte!", 'error')

            $("body").removeClass("wait-cursor");
            $("input[name='submit']").prop('disabled', false)
                .addClass('bold_label')
                .addClass('button')
                .addClass('ui-state-default')
                .addClass('ui-button-label-wrap')
                .addClass('ui-button');
            
        }
    }).fail(function (response) {
        console.log(response)

        //$.notify("Erro ao enviar nota!", {
        //    className: 'error',
        //    autoHide: false,
        //});
        //$('input[name="submit"]').notify("Erro ao enviar nota!", 'error')

        //$("body").removeClass("wait-cursor");
        //$("input[name='submit']").prop('disabled', false)
        //    .addClass('bold_label')
        //    .addClass('button')
        //    .addClass('ui-state-default')
        //    .addClass('ui-button-label-wrap')
        //    .addClass('ui-button');

    })


    $.ajax({
        method: "POST",
        url: config.NotaFiscal + nota, //+ '?pdf=' + pdfFile + '&xml=' + xmlFile + '&evidencia=' + evidFile
        data: JSON.stringify({
            PDFBase64: pdfFile.file,
            PDFBase64Filename: pdfFile.fileName,
            XMLBase64: xmlFile.file,
            XMLBase64Filename: xmlFile.fileName,
            EvidenciaBase64: evidFile.file,
            EvidenciaBase64Filename: evidFile.fileName,
            TXTBase64: txtFile.file,
            TXTBase64Filename: txtFile.fileName,
            nota_numero: $('#Nota_numero').val(),
            contato_nome: $('#Contato_nome').val(),
            contato_telefone: $('#Contato_telefone').val().replace('(', '').replace(')', '').replace('-', '').replace(' ', ''),
            setorFiscal_email: $('#SetorFiscal_email').val(),
            setorFiscal_telefone: $('#SetorFiscal_telefone').val(),
            nota_tipo: $('#Nota_tipo').val(),
            emissao: $('#Emissao').val(),
            serie: '',//$('#Serie').val(),

            MensagemParaOnbase_Valid: MensagemParaOnbase_Valid,
            PresstadorCNPJ_Valid: PresstadorCNPJ_Valid,
            PresstadorCNPJText_Valid: PresstadorCNPJText_Valid,
            TomadorCNPJ_Valid: TomadorCNPJ_Valid,
            TomadorCNPJText_Valid: TomadorCNPJText_Valid,
            ValorNota_Valid: ValorNota_Valid,
            ValorNotaText_Valid: ValorNotaText_Valid,
            NumeroNota_Valid: NumeroNota_Valid,
            NumeroNotaText_Valid: NumeroNotaText_Valid,
            EmissaoNota_Valid: EmissaoNota_Valid,
            EmissaoNotaText_Valid: EmissaoNotaText_Valid,
            CompetenciaNota_Valid: CompetenciaNota_Valid,
            CompetenciaNotaText_Valid: CompetenciaNotaText_Valid,

            enviar: $('#LiberarParaEnvio_input:checked').length == 1 ? true : false,
            Excessao: false
        }),
        contentType: 'application/json',
    }).done(function (result) {
        $.notify("Nota enviada com sucesso!", "success")
        $('input[name="submit"]').notify("Nota enviada com sucesso!", {
            className: 'success',
            autoHide: false,
        });

        /*window.location = "https://osfornecedor.hospitalmoinhos.org.br/client/notafiscal.html"*/
    }).fail(function (response) {
        console.log(response)

        $.notify("Erro ao enviar nota!", {
            className: 'error',
            autoHide: false,
        });
        $('input[name="submit"]').notify("Erro ao enviar nota!", 'error')

        $("body").removeClass("wait-cursor");
        $("input[name='submit']").prop('disabled', false)
            .addClass('bold_label')
            .addClass('button')
            .addClass('ui-state-default')
            .addClass('ui-button-label-wrap')
            .addClass('ui-button');
    })
}

function getData(nota) {

    $.ajax({
        method: "GET",
        url: config.NotaFiscal + nota
    }).done(function (result) {

        if (result.emissao != null || result.emissao) {
            document.getElementById('masterbody').remove()
            $.notify("Nota Fiscal já encaminhada, não é possível encaminha-la novamente!", {
                className: 'info',
                autoHide: false,
            });

            //document.body.setHTML("Nota Fiscal já encaminhada, não é possível encaminha-la novamente!")
            return;
        }

        dto = result;

        $('#Cnpj').val(result.cnpj)

        var sol = result.solicitacao.split('#')
        var OS = sol[0]
        $('#Solicitacao ').val(OS)
        $('#Fornecedor_email').val(result.fornecedor_email)
        $('#Razaosocial').val(result.razaosocial)
        $('#Solicitante_email').val(result.solicitante_email)
        $('#Nota_valor').val(result.nota_valor)

        if (result.excessao) {
            if (new Date(result.excessaoValidade).getTime() < new Date().getTime()) {
                $('input[name="submit"]').prop('disabled', true)
                    .removeClass();

                $.notify("Link de Excessão ja expirado, entre em contato com o suporte!", {
                    className: 'info',
                    autoHide: false,
                });

                return;
            }
        }

    }).fail(function (response) {
        console.log(response)
    })
}

function validateNota() {
    var validate =
        ($('#Nota_numero').val() == ""
            || $('#Contato_nome').val() == ""
            || $('#Contato_telefone').val() == ""
            || $('#SetorFiscal_email').val() == ""
            || $('#SetorFiscal_telefone').val() == ""
            || $('#Nota_valor').val() == ""
            || $('#Cnpj').val() == ""
        )
    // || $('#Nota_tipo').val() == ""
    // || $('#Emissao').val() == ""
    // || $('#Serie').val() == "")

    if ($('#Nota_numero').val() == "") { $('#Nota_numero').notify('Preencha "NÚMERO DA NOTA".', 'warn') }
    if ($('#Contato_nome').val() == "") { $('#Contato_nome').notify('Preencha "NOME DO CONTATO".', 'warn') }
    if ($('#SetorFiscal_email').val() == "") { $('#SetorFiscal_email').notify('Preencha "EMAIL SETOR FISCAL".', 'warn') }
    if ($('#SetorFiscal_telefone').val() == "") { $('#telefone_setorFiscal').notify('Preencha "TELEFONE SETOR FISCAL".', 'warn') }
    if ($('#Contato_telefone').val() == "") { $('#telefoneContato').notify('Preencha "TELEFONE DE CONTATO".', 'warn') }
    if ($('#Nota_valor').val() == "") { $('#VALOR_PAGAMENTO').notify('Preencha "VALOR DA NOTA".', 'warn') }
    if ($('#Cnpj').val() == "") { $('#Cnpj').notify('Preencha "CNPJ".', 'warn') }

    return validate;
}

function validateData() {
    let date = $('#Emissao').val()
    if (date == '') {
        return;
    }
    if (dto.excessao) {
        return true;
    }
    let pattern = /\d{4}-\d{2}-(\d{2})/;
    let result = date.match(pattern);
    let diasUteis = [1, 2, 3, 4, 5]

    var d = new Date(result[0] + 'T00:00:00');
    var today = new Date(new Date().setHours('0', '0', '0', '0'));

    var lasEmissionDay1 = new Date(new Date(new Date().setHours('0', '0', '0', '0')).setDate(25));

    var currentPeriod = (d.getDate() <= 25 && d.getMonth() == today.getMonth())
    var isFeriado = validateFeriado(d) //Vazer cahamda pra Service do TIO pra verificar se é feriado
    //if (!diasUteis.includes(d.getDay()) || isFeriado) {

    //    $('#dataEmissao').notify('A Data preenchida deve ser um dia útil.', 'warn')

    //    return false
    //}


    while (!diasUteis.includes(lasEmissionDay1.getDay()) || validateFeriado(lasEmissionDay1)) {
        lasEmissionDay1.setDate(lasEmissionDay1.getDate() - 1)
    }

    let daysToAdd = 1;
    if (lasEmissionDay1.getDay() === 5) {
        daysToAdd = 3;
    } else if (lasEmissionDay1.getDay() === 6) {
        daysToAdd = 2;
    }

    const nextWorkingDay = new Date(lasEmissionDay1);
    nextWorkingDay.setDate(lasEmissionDay1.getDate() + daysToAdd);

    var auxlasEmissionDay = new Date(nextWorkingDay)
    while (validateFeriado(nextWorkingDay)) {
        auxlasEmissionDay.setDate(nextWorkingDay.getDate() + 1);
        nextWorkingDay.setDate(auxlasEmissionDay.getDate())
    }

    let daysToEmit = 1;
    let workingD4 = false;
    let count4 = 0;
    let lasEmissionDay2 = new Date(new Date(d).setDate(d.getDate() + daysToEmit))
    do {
        if (diasUteis.includes(lasEmissionDay2.getDay())) {
            if (validateFeriado(lasEmissionDay2)) {
                daysToEmit = daysToEmit + 1;
            } else {
                daysToEmit++;
            }
        } else {
            if (lasEmissionDay2.getDay() === 5) {
                daysToEmit = daysToEmit + 3;
            } else if (lasEmissionDay2.getDay() === 6) {
                daysToEmit = daysToEmit + 2;
            } else if (lasEmissionDay2.getDay() === 0) {
                daysToEmit = daysToEmit + 1;
            }
        }

        lasEmissionDay2.setDate(d.getDate() + daysToEmit)
        if (validateFeriado(lasEmissionDay2) || !diasUteis.includes(lasEmissionDay2.getDay())) {
            workingD4 = false;
        } else {
            count4++
        }

        if (count4 === 4) { workingD4 = true; }

    } while (!workingD4)

    if (!currentPeriod) { $('#dataEmissao').notify('Preencha a "DATA DA EMISSÃO" até o dia 25 do mês vigente.', 'warn') }

    if (today > lasEmissionDay2) {
        $('#dataEmissao').notify('Prezado Usuário, o envio de notas não é mais permitido, pois passou do periodo de 4 dias uteis após a emissão', {
            className: 'error',
            autoHide: false,
        });

        $('input[name="submit"]').prop('disabled', true)
            .removeClass();
        return false
    }

    if (today > nextWorkingDay) {
        let nextMonth = parseInt(today.getMonth()) + 2;
        $('#dataEmissao').notify('Prezado Usuário, o envio de notas não é mais permitido, tente novamente no próximo periodo fiscal que inicia em 01/' + nextMonth, {
            className: 'error',
            autoHide: false,
        });

        $('input[name="submit"]').prop('disabled', true)
            .removeClass();
        return false
    }

    if (currentPeriod) {
        $('input[name="submit"]').prop('disabled', false)
            .addClass('bold_label')
            .addClass('button')
            .addClass('ui-state-default')
            .addClass('ui-button-label-wrap')
            .addClass('ui-button');

    }

    return currentPeriod
}

function validateFeriado(d) {
    var dateFormat = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + "-" + (d.getDate().toString().length == 1 ? "0" + d.getDate() : d.getDate());

    return feriados[d.getFullYear()].some(it => it.date === dateFormat)
}

function apenasNumeros(campo) {
    campo.value = campo.value.replace(/\D/g, '');
}



