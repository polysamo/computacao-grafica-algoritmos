/* ==========================================================================
   MATRIZES HOMOGÊNEAS 3×3 (Etapa 4)
   Cada transformação 2D é representada por uma matriz 3x3 em coordenadas
   homogêneas. Transformações compostas (escala/rotação em torno de um
   ponto que não é a origem) são obtidas multiplicando as matrizes entre si
   ANTES de tocar em qualquer vértice: aplicarMatriz() roda uma única vez
   por ponto, nunca as transformações em sequência ponto a ponto.
   ========================================================================== */

function matrizTranslacao(dx, dy) {
  return [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1]
  ];
}

function matrizEscala(sx, sy) {
  return [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1]
  ];
}

function matrizRotacao(anguloGraus) {
  const rad = anguloGraus * Math.PI / 180;
  const cos = Math.cos(rad);
  const sen = Math.sin(rad);
  return [
    [cos, -sen, 0],
    [sen, cos, 0],
    [0, 0, 1]
  ];
}

// Multiplica duas matrizes 3x3 (a × b) — é assim que translação, escala e
// rotação são compostas numa única matriz antes de tocar nos vértices.
function multiplicarMatrizes(a, b) {
  const resultado = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let soma = 0;
      for (let k = 0; k < 3; k++) {
        soma += a[i][k] * b[k][j];
      }
      resultado[i][j] = soma;
    }
  }
  return resultado;
}

// Aplica uma matriz homogênea 3x3 a um ponto (x, y) e devolve o ponto
// cartesiano resultante (a terceira coordenada homogênea do ponto é 1).
function aplicarMatriz(m, ponto) {
  return {
    x: m[0][0] * ponto.x + m[0][1] * ponto.y + m[0][2],
    y: m[1][0] * ponto.x + m[1][1] * ponto.y + m[1][2]
  };
}
