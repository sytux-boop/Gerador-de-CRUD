let listaDados = [] //conjunto de dados
let atividade = '' //variável global de controle
let registo = null //variavel global
bloquearAtributos(true)

//backend (não interage com o html)
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

// Função para procurar um elemento pela chave primária   -------------------------------------------------------------
function procure() {
    const id = document.getElementById("inputId").value
    if (id && Number.isInteger(Number(id)) && id >= 0) {
        registo = procurePorChavePrimaria(id)
        if (registo) { //achou na lista
            mostrarDados(registo)
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none') // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir", "Info")
        } else { //não achou na lista
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

//backend->frontend
function inserir() {
    bloquearAtributos(false)
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline')
    atividade = 'inserindo'
    mostrarAviso("INSERINDO - Digite os atributos e clique no botão salvar", "Warn")
    document.getElementById("inputId").focus()

}

// Função para alterar um elemento da lista
function alterar() {
    bloquearAtributos(false)
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline')
    atividade = 'alterando'
    mostrarAviso("ALTERANDO - Digite os atributos e clique no botão salvar", "Warn")
}

// Função para excluir um elemento da lista
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

    const at1 = document.getElementById("inputNome").value
    const at2 = document.getElementById("inputArea").value
    const at3 = parseInt(document.getElementById("inputTempo").value)

    // Área para verificação específica

    //

    if (id && at1 && at2 && at3) {
        switch (atividade) {
            case 'inserindo':
                registo = new Classe(id, at1, at2, at3)
                listaDados.push(registo)
                mostrarAviso("Registro Salvo!", "Sucess")
                break
            case 'alterando':
                let registroAlterado = new Classe(id, at1, at2, at3)
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

//backend
function preparaListagem(vetor) {
    let texto = ""
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i]
        texto += linha.id + " - " + linha.at1 + " - " + linha.at2 + " - " + linha.at3 + "<br>"
    }
    return texto
}

//backend->frontend (interage com html)
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
    //printa a mensagem na divAviso
    // Tipos de avisos:
    // Error : para erro
    // Warn : para avisos de atenção
    // Success : para ações concluídas
    // Info : para informações
    document.getElementById("divAviso").innerHTML = mensagem
    document.getElementById("divAviso").className = ""
    document.getElementById("divAviso").classList.add(tipo)
}

// Função para mostrar os dados do Classe nos campos
function mostrarDados(registo) {
    document.getElementById("inputId").value = registo.id
    document.getElementById("inputNome").value = registo.at1
    document.getElementById("inputArea").value = registo.at2
    document.getElementById("inputTempo").value = registo.at3

    bloquearAtributos(true)
}

// Função para limpar os dados dos campos
function limparAtributos() {
    document.getElementById("inputNome").value = ""
    document.getElementById("inputArea").value = ""
    document.getElementById("inputTempo").value = ""

    bloquearAtributos(true)
}

function bloquearAtributos(soLeitura) {
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputId").readOnly = !soLeitura
    document.getElementById("inputNome").readOnly = soLeitura
    document.getElementById("inputArea").readOnly = soLeitura
    document.getElementById("inputTempo").readOnly = soLeitura
}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline') 
    document.getElementById("btProcure").style.display = btProcure
    document.getElementById("btInserir").style.display = btInserir
    document.getElementById("btAlterar").style.display = btAlterar
    document.getElementById("btExcluir").style.display = btExcluir
    document.getElementById("btSalvar").style.display = btSalvar
    document.getElementById("btCancelar").style.display = btSalvar // o cancelar sempre aparece junto com o salvar
    document.getElementById("inputId").focus()
}

// Converter listaDados → CSV e salvar em arquivo
function prepararESalvarCSV() {
    const nomeDoArquivoDestino = "Classe.csv"
    let textoCSV = ""

    for (const linha of listaDados) {
        textoCSV += `${linha.id};${linha.at1};${linha.at2};${linha.at3}\n`
    }

    persistirEmLocalPermanente(nomeDoArquivoDestino, textoCSV)
}

// Salvar conteúdo como arquivo local (download)
function persistirEmLocalPermanente(arquivoDestino, conteudo) {
    const blob = new Blob([conteudo], { type: 'text/plain' })  
    const link = document.createElement('a')
    
    link.href = URL.createObjectURL(blob)  // Cria um endereço temporário para o arquivo
    link.download = arquivoDestino         // Define o nome do arquivo
    link.click()                           // Inicia o download automaticamente
    
    URL.revokeObjectURL(link.href)         // Libera memória (boa prática)
}


// Abrir um arquivo CSV do computador do usuário
function abrirArquivoSalvoEmLocalPermanente() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'                   // Só permite CSV

    input.onchange = function (event) {
        const arquivo = event.target.files[0] // Primeiro arquivo escolhido
    
        if (arquivo) {
            converterDeCSVparaListaObjeto(arquivo) // Lê e carrega os dados no programa
        }
    }

    input.click() // Abre a janela de seleção de arquivo
}

// Converter CSV → listaDados (carregar dados no sistema)
function converterDeCSVparaListaObjeto(arquivo) {
    const leitor = new FileReader()

    leitor.onload = function (e) {
        const conteudo = e.target.result
        const linhas = conteudo.split('\n')
        
        listaDados = [] // Reinicia os dados antes de carregar os novos

        for (const linha of linhas) {
            const valores = linha.trim().split(';')

            if (valores.length === 4) { // Evita erros com linhas vazias
                listaDados.push(new Classe(valores[0], valores[1], valores[2], valores[3]))
            }
        }

        listar() // Atualiza a tabela/visualização na tela
    }

    leitor.readAsText(arquivo) // Dispara leitura do arquivo CSV
}
