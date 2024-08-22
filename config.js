var config = (function () {
    //this.apibase = 'https://osfornecedor.hospitalmoinhos.org.br/api/'
    this.apibaseLocalHost = 'https://localhost:7188/api/'

    return {
        apiBase: this.apibase,
        NotaFiscal: this.apibase + 'NotaFiscal/',
        OrdemServico: this.apibase + 'OrdemServico/',
        ValidateNota: this.apibase + 'ValidateNota/',
        RedrectNF: 'https://osfornecedor.hospitalmoinhos.org.br/Client/notafiscal.html',
        RedrectOS: 'https://osfornecedor.hospitalmoinhos.org.br/Client/ordemservico.html'
    }
})();