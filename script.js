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
        inputs += `    <label for="${inputID}">${inputID.charAt(0).toUpperCase() + inputID.slice(1)}: </label>
    <input type="${inputType}" id="${inputID}"><br>\n`
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
    


    // codigoFonte = "<!DOCTYPE html>\n" +
    //     "<html lang=\"en\">\n" +
    //     "\n" +
    //     "<head>\n" +
    //     "    <meta charset=\"UTF-8\">\n" +
    //     "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
    //     "    <title>CRUD " + nomeClasse + "</title>\n" +
    //     "</head>\n" +
    //     "\n" +
    //     "<body>\n\n";
    // document.getElementById("taCodigoFonte").textContent = codigoFonte;
    displayCode(codigoFonte)
}

function gerarController() {
    codigoFonte = ".... basta programar para gerar o Controller como aprendeu em algoritmos no segundo e terceiro bimestres...\n ";
    codigoFonte += "dá trabalho (uma vez) mas depois fica muito mais fácil\n ";
    document.getElementById("taCodigoFonte").textContent = codigoFonte;
}

function displayCode(codigoFonte) {
    document.getElementById("taCodigoFonte").textContent = codigoFonte;
}