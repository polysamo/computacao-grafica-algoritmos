/* ==========================================================================
   BOTÕES E INICIALIZAÇÃO
   ========================================================================== */

document.getElementById('selectAlgoritmo').addEventListener('change', function (evento) {
  algoritmoAtual = evento.target.value;
  montarPainel(algoritmoAtual);
  limparErro();
});

document.getElementById('btnExecutar').addEventListener('click', function () {
  algoritmos[algoritmoAtual].executar();
});

document.getElementById('btnLimpar').addEventListener('click', function () {
  desenharGrade();
  limparErro();
  indicePontoClique = 0;
});

montarSeletorAlgoritmos();
montarPainel(algoritmoAtual);
desenharGrade();
