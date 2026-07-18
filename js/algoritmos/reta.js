/* ==========================================================================
   ALGORITMO: Reta de Bresenham (Etapa 1)
   Ideia: percorre a reta pixel a pixel usando somente aritmética inteira.
   A cada passo acumula um erro que decide se o eixo secundário (y numa reta
   mais horizontal, x numa mais vertical) deve avançar, evitando divisões e
   pontos flutuantes. A forma abaixo cobre os 8 octantes com um único laço.
   Também é a primitiva de baixo nível reaproveitada por polilinha, Bézier
   (segmentos amostrados) e futuramente polígono — todas ligam pares de
   pontos consecutivos chamando esta mesma função.
   ========================================================================== */

// tracejado=true pinta 2 a cada 3 pixels, usado para apoios visuais (ex.:
// polígono de controle das curvas de Bézier) sem recorrer a ctx.setLineDash.
function bresenham(x0, y0, x1, y1, cor, tracejado) {
  x0 = Math.round(x0); y0 = Math.round(y0);
  x1 = Math.round(x1); y1 = Math.round(y1);

  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;

  let erro = dx + dy;
  let x = x0, y = y0;
  let passo = 0;

  while (true) {
    if (!tracejado || (passo % 3) < 2) {
      setPixel(x, y, cor);
    }
    passo++;
    if (x === x1 && y === y1) break;
    const e2 = 2 * erro;
    if (e2 >= dy) { erro += dy; x += sx; }
    if (e2 <= dx) { erro += dx; y += sy; }
  }
}
