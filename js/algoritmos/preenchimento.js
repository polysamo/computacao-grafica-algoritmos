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
    const p = pilha.pop(); // LIFO: aprofunda numa direção até travar, depois retrocede — não precisa de recursão
    const xi = p.x;
    const yi = p.y;

    if (xi <= -DOMINIO || xi >= DOMINIO || yi <= -DOMINIO || yi >= DOMINIO) continue; // célula fora da grade, ignora

    const i = xi + OFFSET;
    const j = yi + OFFSET;
    if (pintado[i][j]) continue; // já é borda ou já foi preenchida, não reprocessa

    setPixel(xi, yi, cor); // marca esta célula antes de empilhar os vizinhos, evitando reentrar nela

    // empilha os 4 vizinhos ortogonais; cada um só é de fato pintado quando
    // sair da pilha e passar pelas checagens de domínio/pintado acima
    pilha.push({ x: xi + 1, y: yi }); // direita
    pilha.push({ x: xi - 1, y: yi }); // esquerda
    pilha.push({ x: xi, y: yi + 1 }); // acima (y cresce para cima nas coordenadas de mundo)
    pilha.push({ x: xi, y: yi - 1 }); // abaixo
  }
}
