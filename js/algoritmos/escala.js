/* ==========================================================================
   ALGORITMO: Escala 2D em torno de um ponto fixo (Etapa 4)
   Ideia: a matriz de escala só funciona corretamente em torno da origem,
   então compõe-se uma única matriz T(+fixo) · Escala(sx,sy) · T(-fixo) por
   multiplicação de matrizes antes de tocar em qualquer vértice — nunca
   aplicando as três transformações em sequência ponto a ponto. O polígono
   original é desenhado em cor clara e o transformado em cor forte.
   ========================================================================== */

function escala(pontos, sx, sy, fixoX, fixoY, corOriginal, corTransformada) {
  poligono(pontos, corOriginal);

  const m = multiplicarMatrizes(
    matrizTranslacao(fixoX, fixoY),
    multiplicarMatrizes(matrizEscala(sx, sy), matrizTranslacao(-fixoX, -fixoY))
  );

  const transformado = pontos.map(function (p) {
    return aplicarMatriz(m, p);
  });

  poligono(transformado, corTransformada);
  setPixel(fixoX, fixoY, COR_PONTOS_CONTROLE);
}
