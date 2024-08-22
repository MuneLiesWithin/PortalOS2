$(document).ready(function() {
    var data = window.location.search.replace('?', '')
    getData(data)
});

// $('#AceitarOrdem').click(function() {
//     sendData('Aceito')
// });

// $('#RecusarOrdem').click(function() {
//     sendData('Recusado')
// });

function sendData(resposta)  {
    var ordemservico = window.location.search.replace('?', '')
    var date = $('#InicioServico_input').val() == '' ? 'null' : $('#InicioServico_input').val()

    $("body").addClass("wait-cursor");
    $("AceitarOrdem").prop('disabled', true)
        .removeClass('bold_label')
        .removeClass('button')
        //.removeClass('ui-state-default')
        .removeClass('ui-button-label-wrap')
        .removeClass('ui-buttonS');
    $("RecusarOrdem").prop('disabled', true)
        .removeClass('bold_label')
        .removeClass('button')
        .removeClass('ui-state-default')
        .removeClass('ui-button-label-wrap')
        .removeClass('ui-button');

    $.ajax({
        method: "POST",
        url: config.OrdemServico + ordemservico + '?Servico_Data=' + date + '&resposta=' + resposta,
        // data: JSON.stringify({ os_dateLogFornecedor: $('#InicioServico_input').val(), os_StatusFornecedor:  })
    }).done(function(result) {
		$.notify("Dados Salvos com sucesso!");
        //window.location = "https://osfornecedor.hospitalmoinhos.org.br/client/OrdemServico.html"
        window.location.reload();        
    }).fail(function(response) {
        console.log('Erro ao salvar dados')

        $("AceitarOrdem").prop('disabled', false)
            .addClass('bold_label')
            .addClass('button')
            //.addClass('ui-state-default')
            .addClass('ui-button-label-wrap')
            .addClass('ui-buttonS');
        $("RecusarOrdem").prop('disabled', false)
            .addClass('bold_label')
            .addClass('button')
            //.addClass('ui-state-default')
            .addClass('ui-button-label-wrap')
            .addClass('ui-button');
    })
}

function validateData() {
    let text = $('#InicioServico_input').val();
    let pattern = /\d{4}-\d{2}-\d{2}/;
    let result = text.match(pattern);

    var d = new Date(result + 'T00:00:00');

    var today = new Date(new Date().setHours('0', '0', '0', '0'))
;   

        //if (d.getDate() + 1 >= 25) {
    if (!!d.valueOf() && d >= today) {
            $('#AceitarOrdem').removeAttr('disabled');
            $('#AceitarOrdem').addClass('bold_label');
            $('#AceitarOrdem').addClass('button')
            //$('#AceitarOrdem').addClass('ui-state-default')
            $('#AceitarOrdem').addClass('ui-button-label-wrap')
            $('#AceitarOrdem').addClass('ui-buttonS')
        }
        else {
            $('#AceitarOrdem').prop('disabled', true);
            $('#AceitarOrdem').removeClass('bold_label');
            $('#AceitarOrdem').removeClass('button')
            //$('#AceitarOrdem').removeClass('ui-state-default')
            $('#AceitarOrdem').removeClass('ui-button-label-wrap')
            $('#AceitarOrdem').removeClass('ui-buttonS')
            $('#InicioServico_input').notify('O campo de "Início do Serviço" Precisa estar preenchido e a data não pode ser menor que a atual!', "warn")
            //alert('O campo de "Início do Serviço" precisa estar preenchido e deve ser após o dia 25!')
        }

        
    //} else { alert('O campo de "Início do Serviço" Precisa estar preenchido!') }
}

function getData(ordemservico) {
    $.ajax({
        method: "GET",
        url: config.OrdemServico + ordemservico
    }).done(function(result) {

        if (result.dataOperacao != null) {
            $('#panel_confirmarRecusar').remove()
           
            var splitDate = result.solicitacao_Data.split(' ')[0].split('/')
            $('#InicioServico_input').val(splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0])
            $('#InicioServico_input').prop("disabled", true);
            $('#logo').notify("Ordem de Serviço já encaminhada!", {
                className: 'info',
                autoHide: false,
                position: "right"
            });
            if (result.resposta == "Aceito" || result.resposta == "Aceito".toUpperCase()) {
                $('#InicioServico_input').notify(result.resposta + "!", {
                    className: 'success',
                    autoHide: false,
                    position: "right"
                });
            } else {
                $('#InicioServico_input').notify(result.resposta + "!", {
                    className: 'error',
                    autoHide: false,
                    position: "right"
                })
            }
            
            //document.body.setHTML("Ordem de Serviço já encaminhada, não é possível encaminha-la novamente!")
            //return;
        }

        $('#ordemServico').val(result.ordemServico)
        $('#solicitacao_Data').val(result.solicitacao_Data.replace('-', '/'))
        $('#Solicitante').val(result.solicitante)
        $('#Setor_Projeto').val(result.setor_Projeto)
        $('#UnidadeHMV').val(result.unidadeHMV)
        $('#Fornecedor_CNPJ').val(result.fornecedor_CNPJ)
        $('#Fornecedor_Endereco').val(result.fornecedor_Endereco)
        $('#Comprador_Nome').val(result.comprador_Nome)
        $('#Comprador_CNPJ').val(result.comprador_CNPJ)
        $('#Comprador_Endereco').val(result.comprador_Endereco)
        $('#Servico_Execucao').val(result.servico_Execucao)
        $('#Servico_Descricao').val(result.servico_Descricao)
        $('#Valor_Os').val(result.valor_Os)
        $('#ValorAdiantamento').val(result.valorAdiantamento)
        $('#CondicaoPagamento').val(result.condicaoPagamento)
        $('#DiasPedidos').val(result.diasPedidos)
        $('#NumeroProposta').val(result.numeroProposta)
        $('#Fornecedor_Nome').val(result.fornecedor_Nome)
        $('#Periodo_Entrega').val(result.expectativaInicio + ' à ' + result.expectativaFim)
        $('#Fornecedor_CNPJ').val(result.fornecedor_CNPJ)

    }).fail(function(response) {
        console.log(response)
    })
}
