/* ==========================================================================
   INTERAÇÃO: mouse sobre a grade e clique preenchendo os campos de ponto
   em ordem
   ========================================================================== */

function coordenadaDoEvento(evento) {
  const rect = canvas.getBoundingClientRect();
  const escalaX = canvas.width / rect.width;
  const escalaY = canvas.height / rect.height;
  const px = (evento.clientX - rect.left) * escalaX;
  const py = (evento.clientY - rect.top) * escalaY;
  return telaParaMundo(px, py);
}

canvas.addEventListener('mousemove', function (evento) {
  const { x, y } = coordenadaDoEvento(evento);
  document.getElementById('statusCoord').textContent =
    'Coordenada do mundo: (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')';
});

canvas.addEventListener('mouseleave', function () {
  document.getElementById('statusCoord').textContent = 'Coordenada do mundo: (—, —)';
});

canvas.addEventListener('click', function (evento) {
  const { x, y } = coordenadaDoEvento(evento);

  // arredonda e restringe ao domínio válido de entrada (-10..10)
  const xi = Math.max(-10, Math.min(10, Math.round(x)));
  const yi = Math.max(-10, Math.min(10, Math.round(y)));

  const cfg = algoritmos[algoritmoAtual];

  // algoritmos com número variável de pontos (ex.: polilinha) acumulam o
  // clique no campo de texto "x,y; x,y; ...", em vez de campos fixos
  if (cfg.entradaTexto) {
    const campo = document.getElementById(cfg.entradaTexto.id);
    const atual = campo.value.trim();
    campo.value = atual ? atual + '; ' + xi + ',' + yi : xi + ',' + yi;
    return;
  }

  if (!cfg.pontos || !cfg.pontos.length) return;

  const pt = cfg.pontos[indicePontoClique % cfg.pontos.length];
  document.getElementById(pt.idX).value = xi;
  document.getElementById(pt.idY).value = yi;

  indicePontoClique = (indicePontoClique + 1) % cfg.pontos.length;
});
