/* ==========================================================================
   ALGORITMO: Preenchimento — flood fill com pilha explícita (Etapa 5)
   Ideia: a partir de uma semente interna, empilha os 4 vizinhos (cima,
   baixo, esquerda, direita) de cada célula pintada e continua até a pilha
   esvaziar — nunca por recursão, que estouraria a pilha de chamadas em
   regiões grandes. Cada célula só é visitada uma vez porque consulta a
   matriz booleana pintado[][] (nunca lê pixels de volta do canvas): se já
   está pintada, é fundo já preenchido ou borda, e a busca não avança por ali.
   ========================================================================== */

function preenchimento(semente, cor) {
  const pilha = [{ x: Math.round(semente.x), y: Math.round(semente.y) }];

  while (pilha.length > 0) {
    const p = pilha.pop();
    const xi = p.x;
    const yi = p.y;

    if (xi <= -DOMINIO || xi >= DOMINIO || yi <= -DOMINIO || yi >= DOMINIO) continue;

    const i = xi + OFFSET;
    const j = yi + OFFSET;
    if (pintado[i][j]) continue; // já é borda ou já foi preenchida

    setPixel(xi, yi, cor);

    pilha.push({ x: xi + 1, y: yi });
    pilha.push({ x: xi - 1, y: yi });
    pilha.push({ x: xi, y: yi + 1 });
    pilha.push({ x: xi, y: yi - 1 });
  }
}
