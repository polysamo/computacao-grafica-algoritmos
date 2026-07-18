/* ==========================================================================
   ALGORITMO: Rotação 2D em torno de um pivô (Etapa 4)
   Ideia: a matriz de rotação só gira corretamente em torno da origem,
   então compõe-se uma única matriz T(+pivô) · Rotação(ângulo) · T(-pivô)
   por multiplicação de matrizes antes de tocar em qualquer vértice. Ângulos
   negativos giram no sentido horário — Math.cos/Math.sin já tratam isso sem
   nenhum caso especial. O polígono original é desenhado em cor clara e o
   transformado em cor forte.
   ========================================================================== */

function rotacaoPivo(pontos, anguloGraus, pivoX, pivoY, corOriginal, corTransformada) {
  poligono(pontos, corOriginal);

  // lida da direita para a esquerda: leva o pivô para a origem, gira em
  // torno da origem (única rotação que a matriz sabe fazer), e translada de
  // volta — a mesma composição usada em escala(), só trocando a matriz do meio
  const m = multiplicarMatrizes(
    matrizTranslacao(pivoX, pivoY),
    multiplicarMatrizes(matrizRotacao(anguloGraus), matrizTranslacao(-pivoX, -pivoY))
  );

  const transformado = pontos.map(function (p) {
    return aplicarMatriz(m, p);
  });

  poligono(transformado, corTransformada);
  setPixel(pivoX, pivoY, COR_PONTOS_CONTROLE);
}
