function gerarModel() {
    const nomeClasse = document.querySelector("#nomeClasse").value
    const atributos = document.querySelector("#atributos").value
    const vetAtributos = atributos.split(", ")

    let declaracaoAtributos = ""
    for (let i = 0; i < vetAtributos.length; i++) {
        const at = vetAtributos[i];
        declaracaoAtributos += `        this.${at} = ${at};\n`
    }

    const codigoFonte = `class ${nomeClasse} {
    constructor(id, ${atributos}, posicaoNaLista) {
        this.id = id;
${declaracaoAtributos}
        this.posicaoNaLista = posicaoNaLista;
    }
}`

    displayCode(codigoFonte)
}


function gerarView() {
    const nomeClasse = document.querySelector("#nomeClasse").value
    const atributos = document.querySelector("#atributos").value
    const vetAtributos = atributos.split(", ")
    const atributosTipo = document.querySelector("#atributosTipo").value
    const vetAtributosTipo = atributosTipo.split(", ")

    let inputs = ""
    for(let i = 0; i < vetAtributos.length; i++) {
        let inputID = vetAtributos[i]
        let inputType = vetAtributosTipo[i]

        if (inputType == "select") {
            inputs += `    <label for="${inputID}">${inputID.charAt(0).toUpperCase() + inputID.slice(1)}: </label>
    <select id="${inputID}" name="${inputID}">
        <option value="0">Opção 1</option>
        <option value="1">Opção 2</option>
        <option value="2">Opção 3</option>
    </select>\n`
        } else {
            inputs += `    <label for="${inputID}">${inputID.charAt(0).toUpperCase() + inputID.slice(1)}: </label>
    <input type="${inputType}" id="${inputID}"><br>\n`
        }
    }

    const codigoFonte = `<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>CRUD ${nomeClasse}</title>
   <style>
      #divAviso {
         padding: 5px;
         width: fit-content;
      }
      .Error {
         background-color: #ff3c2e;
      }
      .Warn {
         background-color: #ffd900;
      }
      .Sucess {
         background-color: #5cff6c;
      }
      .Info {
         background-color: #00bfff;
      }
   </style>
</head>

<body>

   <h1>Cadastro de ${nomeClasse}</h1>

   <label for="inputId">Id</label>
   <input type="number" name="inputId" id="inputId">
   <input type="button" value="Procure" id="btProcure" onclick="procure()" style="display:inline;">
   <input type="button" value="Inserir" id="btInserir" onclick="inserir()" style="display:none;">
   <input type="button" value="Alterar" id="btAlterar" onclick="alterar()" style="display:none;">
   <input type="button" value="Excluir" id="btExcluir" onclick="excluir()" style="display:none;">
   <br><br>

   <!-- Inputs de atribuição -->
${inputs}
   <!-- ----- -->

   <br><br>
   <div id="divAviso" class=""></div>
   <br>
   
   <input type="button" value="Salvar" id="btSalvar" onclick="salvar()" style="display:none;">
   <input type="button" value="Cancelar" id="btCancelar" onclick="cancelarOperacao()" style="display:none;">
   <br><br>

   <!-- Listagem Personalizada  -->

   <input type="button" value="Listar" onclick="listar()">
   <br><br>
   <!-- ----- -->

   <div id="outputSaida" style="background-color: #BBDCE5; width: fit-content; padding: 5px;"></div>
   <br>

   <input type="button" value="Persistir" id="btPersisitir" onclick="prepararESalvarCSV()">
   <input type="button" value="Recuperar" id="btRecuperar" onclick="abrirArquivoSalvoEmLocalPermanente()">

   <script src="./Model.js"></script>
   <script src="./Controller.js"></script>
</body>
</html>`
    
    displayCode(codigoFonte)
}

function gerarController() {
    const nomeClasse = document.querySelector("#nomeClasse").value
    const atributos = document.querySelector("#atributos").value
    const vetAtributos = atributos.split(", ")
    const atributosTipo = document.querySelector("#atributosTipo").value
    const vetAtributosTipo = atributosTipo.split(", ")

    let atribuicaoValores = ""
    let verificacoes = ""
    let separadoVirgula = ""
    let listagem = ""
    let preencher = ""
    let limpar = ""
    let readOnly = ""
    let valores = ""
    let listarToCSV = ""
    for(let i = 0; i < vetAtributos.length; i++) {
        if (vetAtributosTipo[i] == "number") {
            atribuicaoValores += `    const ${vetAtributos[i]} = parseInt(document.getElementById("${vetAtributos[i]}").value)\n`
        } else {
            atribuicaoValores += `    const ${vetAtributos[i]} = document.getElementById("${vetAtributos[i]}").value\n`
        }

        verificacoes += ` && ${vetAtributos[i]}`
        separadoVirgula += `, ${vetAtributos[i]}`
        listagem += ` + " - " + linha.${vetAtributos[i]}`
        preencher += `    document.getElementById("${vetAtributos[i]}").value = registo.${vetAtributos[i]}\n`
        limpar += `    document.getElementById("${vetAtributos[i]}").value = ""\n`

        if (vetAtributosTipo[i] == "select") {
            readOnly += `    document.getElementById("${vetAtributos[i]}").disabled = soLeitura\n`
        } else {
            readOnly += `    document.getElementById("${vetAtributos[i]}").readOnly = soLeitura\n`
        }

        listarToCSV += `;\${ linha.${vetAtributos[i]} }`
    }
    
    for (let i = 1; i < vetAtributos.length + 1; i++) {
        valores += `, valores[${i}]`
    }
    const codigoFonte = `let listaDados = [] 
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

${atribuicaoValores}

    if (id${verificacoes}) {
        switch (atividade) {
            case 'inserindo':
                registo = new ${nomeClasse}(id${separadoVirgula})
                listaDados.push(registo)
                mostrarAviso("Registro Salvo!", "Sucess")
                break
            case 'alterando':
                let registroAlterado = new ${nomeClasse}(id${separadoVirgula})
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
        texto += linha.id${listagem} + "<br>"
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
${preencher}

    bloquearAtributos(true)
}

function limparAtributos() {
${limpar}

    bloquearAtributos(true)
}

function bloquearAtributos(soLeitura) { 
    document.getElementById("inputId").readOnly = !soLeitura
${readOnly}
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
    const nomeDoArquivoDestino = "${nomeClasse}.csv"
    let textoCSV = ""

    for (const linha of listaDados) {
        textoCSV += \`\${linha.id}${listarToCSV}\\n\`
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
        const linhas = conteudo.split('\\n')
        listaDados = [] 

        for (const linha of linhas) {
            const valores = linha.trim().split(';')

            if (valores.length === ${vetAtributos.length + 1}) {
                listaDados.push(new ${nomeClasse}(valores[0]${valores}))
            }
        }
        listar()
    }

    leitor.readAsText(arquivo)
}`
    
    displayCode(codigoFonte)
}

function displayCode(codigoFonte) {
    document.getElementById("taCodigoFonte").textContent = codigoFonte;
}