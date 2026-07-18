/* ==========================================================================
   PAINEL DINÂMICO
   Monta os campos de entrada de acordo com o algoritmo selecionado. Cada
   algoritmo declara em catalogo.js até três tipos de campo:
   - pontos: pares de x/y de posição fixa, preenchíveis por clique
   - entradaTexto: um campo único para lista de N pontos ("x,y; x,y; ...")
   - camposExtras: números soltos (tipo 'number', ex.: raio) ou sliders
     (tipo 'slider', ex.: ângulo de rotação) — sliders redesenham ao vivo
     a cada arraste, para ficar demonstrável em vídeo
   Algoritmos com autoExecutar: true (as projeções do cubo) já aparecem
   desenhados assim que o painel é montado, sem esperar o clique em Executar.
   ========================================================================== */

let algoritmoAtual = 'reta';
let indicePontoClique = 0;

function montarPainel(chave) {
  const cfg = algoritmos[chave];
  const container = document.getElementById('painelCampos');
  container.innerHTML = '';

  (cfg.pontos || []).forEach(function (pt) {
    const linha = document.createElement('div');
    linha.className = 'campo-linha';

    const campoX = document.createElement('div');
    campoX.className = 'campo';
    campoX.innerHTML =
      '<label for="' + pt.idX + '">' + pt.rotulo + ' — x</label>' +
      '<input type="number" id="' + pt.idX + '" min="-10" max="10" step="1" value="0">';

    const campoY = document.createElement('div');
    campoY.className = 'campo';
    campoY.innerHTML =
      '<label for="' + pt.idY + '">' + pt.rotulo + ' — y</label>' +
      '<input type="number" id="' + pt.idY + '" min="-10" max="10" step="1" value="0">';

    linha.appendChild(campoX);
    linha.appendChild(campoY);
    container.appendChild(linha);
  });

  if (cfg.entradaTexto) {
    const et = cfg.entradaTexto;
    const campo = document.createElement('div');
    campo.className = 'campo';
    campo.innerHTML =
      '<label for="' + et.id + '">' + et.rotulo + '</label>' +
      '<input type="text" id="' + et.id + '" placeholder="' + et.placeholder + '" value="">';
    container.appendChild(campo);
  }

  (cfg.camposExtras || []).forEach(function (ce) {
    const campo = document.createElement('div');
    campo.className = 'campo';

    if (ce.tipo === 'slider') {
      campo.innerHTML =
        '<label for="' + ce.id + '">' + ce.rotulo + ': <span id="' + ce.id + 'Valor">' + ce.valor + '</span></label>' +
        '<input type="range" id="' + ce.id + '" min="' + ce.min + '" max="' + ce.max + '" step="' + ce.step + '" value="' + ce.valor + '">';
    } else {
      campo.innerHTML =
        '<label for="' + ce.id + '">' + ce.rotulo + '</label>' +
        '<input type="number" id="' + ce.id + '" min="' + ce.min + '" max="' + ce.max + '" step="' + ce.step + '" value="' + ce.valor + '">';
    }

    container.appendChild(campo);
  });

  // sliders redesenham ao vivo, atualizando o rótulo com o valor atual
  container.querySelectorAll('input[type="range"]').forEach(function (input) {
    input.addEventListener('input', function () {
      const rotulo = document.getElementById(input.id + 'Valor');
      if (rotulo) rotulo.textContent = input.value;
      cfg.executar();
    });
  });

  indicePontoClique = 0;

  if (cfg.autoExecutar) {
    cfg.executar();
  }
}

function montarSeletorAlgoritmos() {
  const select = document.getElementById('selectAlgoritmo');
  Object.keys(algoritmos).forEach(function (chave) {
    const opt = document.createElement('option');
    opt.value = chave;
    opt.textContent = algoritmos[chave].nome;
    select.appendChild(opt);
  });
  select.value = algoritmoAtual;
}
