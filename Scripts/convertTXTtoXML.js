function convertTXT(txt) {

    var lines = txt.split(/\r?\n|\r|\n/g)
    
    return '<xml><nfe>' + lines[1].substring(1, 9) + '</nfe>'
        + '<emissao>' + lines[1].substring(53, 61) + '</emissao>'
		// + '<ceompetencia>' + lines[1].substring(53, 61) + '</ceompetencia>'
        + '<cnpjPrestador>' + lines[1].substring(70, 84) + '</cnpjPrestador>'
        + '<valor>' + lines[1].substring(447, 462).replace(/^0+/, '') + '</valor>'
        + '<cnpjTomador>' + lines[1].substring(518, 532) + '</cnpjTomador></xml>'

}

function extractData(txt) {
    var lines = txt.split(/\r?\n|\r|\n/g)

    const tomadorRegex = new RegExp('92.?685.?833');

    var _CNPJTomador = lines[1].substring(518, 532);
    if (_CNPJTomador.trim().Length == 0) {
        _CNPJTomador = lines[1].substring(149, 163);
    }

    var _ISSQNALiquota = lines[1].substring(482, 486).replace(/^0+/, '')
    _ISSQNALiquota = _ISSQNALiquota.substring(0, _ISSQNALiquota.length - 2) + ',' + _ISSQNALiquota.substring(_ISSQNALiquota.length - 2)

    var _BaseCalculo = lines[1].substring(447, 462).replace(/^0+/, '')
    _BaseCalculo = _BaseCalculo.substring(0, _BaseCalculo.length - 2) + ',' + _BaseCalculo.substring(_BaseCalculo.length - 2)

    var _CSLLValor = lines[1].substring(1096, 1111).trim().length == 0 ? lines[1].substring(727, 742) : lines[1].substring(1096, 1111)
    _CSLLValor = _CSLLValor.replace(/^0+/, '')
    _CSLLValor = _CSLLValor.substring(0, _CSLLValor.length - 2) + ',' + _CSLLValor.substring(_CSLLValor.length - 2)

    var _CofinsValor = lines[1].substring(1051, 1066).trim().length == 0 ? lines[1].substring(682, 697) : lines[1].substring(1051, 1066)
    _CofinsValor = _CofinsValor.replace(/^0+/, '')
    _CofinsValor = _CofinsValor.substring(0, _CofinsValor.length - 2) + ',' + _CofinsValor.substring(_CofinsValor.length - 2)

    var _INSSValor = lines[1].substring(1066, 1081).trim().length == 0 ? lines[1].substring(697, 712) : lines[1].substring(1066, 1081)
    _INSSValor = _INSSValor.replace(/^0+/, '')
    _INSSValor = _INSSValor.substring(0, _INSSValor.length - 2) + ',' + _INSSValor.substring(_INSSValor.length - 2)

    var _IRRFValor = lines[1].substring(1081, 1096).trim().length == 0 ? lines[1].substring(712, 727) : lines[1].substring(1081, 1096)
    _IRRFValor = _IRRFValor.replace(/^0+/, '')
    _IRRFValor = _IRRFValor.substring(0, _IRRFValor.length - 2) + ',' + _IRRFValor.substring(_IRRFValor.length - 2)

    var _PISValor = lines[1].substring(1037, 1051).trim().length == 0 ? lines[1].substring(667, 682) : lines[1].substring(1037, 1051)
    _PISValor = _PISValor.replace(/^0+/, '')
    _PISValor = _PISValor.substring(0, _PISValor.length - 2) + ',' + _PISValor.substring(_PISValor.length - 2)

    var _ISSQNValor = lines[1].substring(486, 501).replace(/^0+/, '')
    _ISSQNValor = _ISSQNValor.substring(0, _ISSQNValor.length - 2) + ',' + _ISSQNValor.substring(_ISSQNValor.length - 2)

    var _DataEmissao = lines[1].substring(9, 23)
    _DataEmissao = _DataEmissao.substring(0, 4) + '-' + _DataEmissao.substring(4, 6) + '-' + _DataEmissao.substring(6, 8)

    var _DataEmissao2 = lines[1].substring(17, 31);
    _DataEmissao2 = _DataEmissao2.substring(0, 4) + '-' + _DataEmissao2.substring(4, 2) + '-' + _DataEmissao2.substring(6, 2);

    var _DescontoValor = lines[1].substring(462, 477).replace(/^0+/, '')
    if (_DescontoValor !== "") {
        _DescontoValor = _DescontoValor.substring(0, _DescontoValor.length - 2) + ',' + _DescontoValor.substring(_DescontoValor.length - 2);
    }

    debugger;

    var json = {
        Emissor: lines[1].substring(84, 159).trimEnd().replace('&', 'e'),
        CNPJPrestador: lines[1].substring(70, 84),
        CNPJTomador: _CNPJTomador,
        NumeroNota: lines[1].substring(1, 9).replace(/^0+/, ''),
        NumeroNota2: lines[1].substring(9, 17).replace(/^0+/, ''),
        DataEmissao: _DataEmissao,
        DataEmissao2: _DataEmissao2,
        ValorServico: _BaseCalculo,
        ValorLiquido: '',
        BaseCalculo: _BaseCalculo,
        Descricao: '',
        UF: lines[1].substring(332, 334),
        ISSQNValor: _ISSQNValor,
        ISSQNALiquota: _ISSQNALiquota,
        INSSValor: _INSSValor,
        INSSAliquota: '',
        DescontoValor: '',
        DescontoAliquota: '',
        PISValor: _PISValor,
        PISAliquota: '',
        CofinsValor: _CofinsValor,
        CofinsAliquota: '',
        CSLLValor: _CSLLValor,
        CSLLAliquota: '',
        IRRFValor: _IRRFValor,
        IRRFAliquota: ''
    }

    xml = OBJtoXML(json)

    return xml
}

function OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                xml += "<" + prop + ">";
                xml += OBJtoXML(new Object(obj[prop][array]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += OBJtoXML(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    //var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return '<?xml version="1.0" encoding="UTF-8"?><NFSE>' + xml + '</NFSE>'
}