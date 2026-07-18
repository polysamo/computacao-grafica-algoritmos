/* ==========================================================================
   CONVERSÕES DE COORDENADAS
   ========================================================================== */

// Converte coordenada cartesiana de mundo em pixel do canvas.
// O eixo Y do mundo cresce para cima, então é invertido em relação ao canvas.
function mundoParaTela(x, y) {
  const px = (x + DOMINIO) * ESCALA;
  const py = (DOMINIO - y) * ESCALA;
  return { px, py };
}

// Converte pixel do canvas (ex.: posição do clique do mouse) em coordenada de mundo.
function telaParaMundo(px, py) {
  const x = px / ESCALA - DOMINIO;
  const y = DOMINIO - py / ESCALA;
  return { x, y };
}
