/* ==========================================================================
   ALGORITMO: Círculo — ponto médio (midpoint circle) (Etapa 2)
   Ideia: calcula só o primeiro octante (de x=0 até x=y) usando um critério
   de decisão inteiro que aproxima a equação do círculo x²+y²=r², e replica
   cada ponto calculado nos outros 7 octantes por simetria em torno do
   centro (cx, cy) — sem raiz quadrada e sem ponto flutuante.
   O centro não é destacado com setPixel (ao contrário dos outros
   algoritmos) de propósito: é o ponto mais natural para semear o
   preenchimento (Etapa 5), e marcá-lo deixaria essa célula ocupada.
   ========================================================================== */

function circunferencia(cx, cy, raio, cor) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  raio = Math.round(raio);

  let x = 0;
  let y = raio;
  let d = 1 - raio; // critério de decisão do ponto médio

  plotarOitoOctantes(cx, cy, x, y, cor);

  while (x < y) {
    if (d < 0) {
      // ponto médio ainda está dentro do círculo: o próximo pixel horizontal
      // (x+1, y) já é a melhor aproximação, y não muda
      d += 2 * x + 3;
    } else {
      // ponto médio caiu fora do círculo: o pixel diagonal (x+1, y-1) é que
      // aproxima melhor a curva, então y também recua
      d += 2 * (x - y) + 5;
      y--;
    }
    x++;
    plotarOitoOctantes(cx, cy, x, y, cor); // replica o par (x, y) recém-calculado nos 8 octantes
  }
}

// Espelha um ponto (x, y) do primeiro octante nos outros 7, em torno do centro.
function plotarOitoOctantes(cx, cy, x, y, cor) {
  setPixel(cx + x, cy + y, cor);
  setPixel(cx - x, cy + y, cor);
  setPixel(cx + x, cy - y, cor);
  setPixel(cx - x, cy - y, cor);
  setPixel(cx + y, cy + x, cor);
  setPixel(cx - y, cy + x, cor);
  setPixel(cx + y, cy - x, cor);
  setPixel(cx - y, cy - x, cor);
}
