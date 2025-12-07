let listaDados = [] 
let atividade = '' 
let registo = null 
bloquearAtributos(true)

function procurePorChavePrimaria(chave) {
    for(let i = 0;i < listaDados.length;i++) {
        const dado = listaDados[i]
        if (dado.id == chave) {
            dado.posicaoNaLista = i
            return dado
        }
    }
    return null
}

function procure() {
    const id = document.getElementById("inputId").value
    if (id && Number.isInteger(Number(id)) && id >= 0) {
        registo = procurePorChavePrimaria(id)
        if (registo) { 
            mostrarDados(registo)
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none') 
            mostrarAviso("Achou na lista, pode alterar ou excluir", "Info")
        } else { 
            limparAtributos()
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none')
            mostrarAviso("Não achou na lista, pode inserir", "Info")
        }
    } else {
        mostrarAviso("ID não suportado. O ID deve ser um numero inteiro e positivo.", "Error")
        document.getElementById("inputId").focus()
        return
    }
}


function inserir() {
    bloquearAtributos(false)
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline')
    atividade = 'inserindo'
    mostrarAviso("INSERINDO - Digite os atributos e clique no botão salvar", "Warn")
    document.getElementById("inputId").focus()
}

function alterar() {
    bloquearAtributos(false)
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline')
    atividade = 'alterando'
    mostrarAviso("ALTERANDO - Digite os atributos e clique no botão salvar", "Warn")
}

function excluir() {
    bloquearAtributos(false)
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline')
    atividade = 'excluindo'
    mostrarAviso("EXCLUINDO - clique no botão salvar para confirmar a exclusão", "Warn")
}

function salvar() {
    let id
    if (registo == null) {
        id = parseInt(document.getElementById("inputId").value)
    } else {
        id = registo.id
    }

    const nome = document.getElementById("nome").value
    const matricula = document.getElementById("matricula").value
    const coeficiente = parseInt(document.getElementById("coeficiente").value)
    const escola = document.getElementById("escola").value


    if (id && nome && matricula && coeficiente && escola) {
        switch (atividade) {
            case 'inserindo':
                registo = new Alunos(id, nome, matricula, coeficiente, escola)
                listaDados.push(registo)
                mostrarAviso("Registro Salvo!", "Sucess")
                break
            case 'alterando':
                let registroAlterado = new Alunos(id, nome, matricula, coeficiente, escola)
                listaDados[registo.posicaoNaLista] = registroAlterado
                mostrarAviso("Registro Alterado!", "Sucess")
                break
            case 'excluindo':
                listaDados.splice(registo.posicaoNaLista, 1)
                mostrarAviso("Registro Deletado!", "Sucess")
                break
            default:
                mostrarAviso("Erro interno! Sinto muito :(", "Error")
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none')
        limparAtributos()
        listar()
        document.getElementById("inputId").focus()
    } else {
        alert("Erro nos dados digitados")
        return
    }
}

function preparaListagem(vetor) {
    let texto = ""
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i]
        texto += linha.id + " - " + linha.nome + " - " + linha.matricula + " - " + linha.coeficiente + " - " + linha.escola + "<br>"
    }
    return texto
}

function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaDados)
}

function cancelarOperacao() {
    limparAtributos()
    bloquearAtributos(true)
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none')
    mostrarAviso("Edição cancelada", "Warn")
}

function mostrarAviso(mensagem, tipo) {
    document.getElementById("divAviso").innerHTML = mensagem
    document.getElementById("divAviso").className = ""
    document.getElementById("divAviso").classList.add(tipo)
}

function mostrarDados(registo) {
    document.getElementById("inputId").value = registo.id
    document.getElementById("nome").value = registo.nome
    document.getElementById("matricula").value = registo.matricula
    document.getElementById("coeficiente").value = registo.coeficiente
    document.getElementById("escola").value = registo.escola


    bloquearAtributos(true)
}

function limparAtributos() {
    document.getElementById("nome").value = ""
    document.getElementById("matricula").value = ""
    document.getElementById("coeficiente").value = ""
    document.getElementById("escola").value = ""


    bloquearAtributos(true)
}

function bloquearAtributos(soLeitura) { 
    document.getElementById("inputId").readOnly = !soLeitura
    document.getElementById("nome").readOnly = soLeitura
    document.getElementById("matricula").readOnly = soLeitura
    document.getElementById("coeficiente").readOnly = soLeitura
    document.getElementById("escola").disabled = soLeitura

}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure
    document.getElementById("btInserir").style.display = btInserir
    document.getElementById("btAlterar").style.display = btAlterar
    document.getElementById("btExcluir").style.display = btExcluir
    document.getElementById("btSalvar").style.display = btSalvar
    document.getElementById("btCancelar").style.display = btSalvar 
    document.getElementById("inputId").focus()
}

function prepararESalvarCSV() {
    const nomeDoArquivoDestino = "Alunos.csv"
    let textoCSV = ""

    for (const linha of listaDados) {
        textoCSV += `${linha.id};${ linha.nome };${ linha.matricula };${ linha.coeficiente };${ linha.escola }\n`
    }

    persistirEmLocalPermanente(nomeDoArquivoDestino, textoCSV)
}

function persistirEmLocalPermanente(arquivoDestino, conteudo) {
    const blob = new Blob([conteudo], { type: 'text/plain' })  
    const link = document.createElement('a')
    
    link.href = URL.createObjectURL(blob)  
    link.download = arquivoDestino         
    link.click()                           
    
    URL.revokeObjectURL(link.href)         
}

function abrirArquivoSalvoEmLocalPermanente() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'                   

    input.onchange = function (event) {
        const arquivo = event.target.files[0] 
    
        if (arquivo) {
            converterDeCSVparaListaObjeto(arquivo) 
        }
    }
    input.click() 
}

function converterDeCSVparaListaObjeto(arquivo) {
    const leitor = new FileReader()

    leitor.onload = function (e) {
        const conteudo = e.target.result
        const linhas = conteudo.split('\n')
        listaDados = [] 

        for (const linha of linhas) {
            const valores = linha.trim().split(';')

            if (valores.length === 5) {
                listaDados.push(new Alunos(valores[0], valores[1], valores[2], valores[3], valores[4]))
            }
        }
        listar()
    }

    leitor.readAsText(arquivo)
}