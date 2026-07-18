/* ==========================================================================
   ALGORITMO: Polilinha (Etapa 2)
   Ideia: recebe uma lista ordenada de N > 3 pontos e liga cada par de
   pontos consecutivos com bresenham(), sem fechar o último segmento de
   volta ao primeiro ponto — é o que diferencia a polilinha de um polígono.
   ========================================================================== */

function polilinha(pontos, cor) {
  for (let i = 0; i < pontos.length - 1; i++) {
    bresenham(pontos[i].x, pontos[i].y, pontos[i + 1].x, pontos[i + 1].y, cor);
  }

  pontos.forEach(function (p) {
    setPixel(p.x, p.y, COR_PONTOS_CONTROLE);
  });
}
