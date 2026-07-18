# Roteiro do vídeo explicativo

Rascunho baseado no comentário de topo de cada função de algoritmo em `js/algoritmos/`.
Cada seção vira um bloco do vídeo: mostrar a interface executando o algoritmo enquanto
se explica a ideia abaixo.

## Base (grade, eixos, setPixel)

- Domínio cartesiano -11 a 11, eixo Y invertido em relação ao canvas.
- `mundoParaTela`/`telaParaMundo` fazem a conversão de coordenadas nos dois sentidos.
- `setPixel(x, y, cor)` é o único ponto de contato dos algoritmos com o canvas: pinta a
  célula unitária centrada no inteiro mais próximo e atualiza a matriz booleana
  `pintado[22][22]`, que será consultada (não lida do canvas) pelo algoritmo de
  preenchimento numa etapa futura.

## Reta (Bresenham) — Etapa 1

Percorre a reta pixel a pixel usando somente aritmética inteira. A cada passo acumula
um erro que decide se o eixo secundário (y numa reta mais horizontal, x numa mais
vertical) deve avançar, evitando divisões e pontos flutuantes. A implementação cobre
os 8 octantes com um único laço (`dx`, `dy`, `sx`, `sy`, `erro`).

## Polilinha — Etapa 2

Recebe uma lista ordenada de N > 3 pontos (digitados no formato `x,y; x,y; ...` ou
acumulados por cliques na grade) e liga cada par de pontos consecutivos com
`bresenham()`, sem fechar o último segmento de volta ao primeiro ponto — é o que
diferencia a polilinha de um polígono.

## Bézier grau 2 — Etapa 2

Amostra B(t) = (1-t)²P0 + 2(1-t)t·P1 + t²P2 em passos fixos de t (~0,02), arredonda
cada ponto amostrado para a grade e liga os pontos consecutivos com `bresenham()` — a
curva nunca é traçada com uma primitiva nativa. O polígono de controle (P0-P1-P2) é
desenhado em cor secundária e tracejado, só como apoio visual.

## Bézier grau 3 — Etapa 2

Mesma ideia da Bézier de grau 2, mas com dois pontos de controle: B(t) = (1-t)³P0 +
3(1-t)²t·P1 + 3(1-t)t²P2 + t³P3. O polígono de controle (P0-P1-P2-P3) segue o mesmo
tratamento visual tracejado.

## Círculo (ponto médio) — Etapa 2

Calcula só o primeiro octante (de x=0 até x=y) usando um critério de decisão inteiro
que aproxima a equação do círculo x²+y²=r², e replica cada ponto calculado nos outros
7 octantes por simetria em torno do centro (cx, cy) — sem raiz quadrada e sem ponto
flutuante.

## Cubo 3D — dados e rotação (base da Etapa 3)

Um cubo fixo de 8 vértices e 12 arestas (definido em código) é rotacionado em torno
dos eixos X e Y a partir de dois sliders, antes de qualquer projeção. Cada projeção
só muda como (x, y, z) rotacionado vira (x, y); as 12 arestas são sempre rasterizadas
ligando os vértices projetados e arredondados com `bresenham()`.

## Projeção Ortogonal — Etapa 3

Descarta a coordenada Z de cada vértice já rotacionado e usa só (x, y) como ponto
2D — a projeção paralela mais simples, sem nenhuma deformação por profundidade.

## Projeção Oblíqua (cavalier/cabinet) — Etapa 3

Soma à posição (x, y) de cada vértice rotacionado uma parcela da profundidade Z
multiplicada por cos/sen de um ângulo: x' = x + z·cos(θ), y' = y + z·sen(θ). Fator
1,0 dá a cavalier (profundidade em escala real), fator 0,5 dá a cabinet (profundidade
reduzida à metade); fator e ângulo são ajustáveis por slider.

## Projeção Perspectiva (1 ponto de fuga) — Etapa 3

Escala (x, y) de cada vértice rotacionado pelo fator d/(d+z), em que d é a distância
do observador ao plano de projeção: x' = x·d/(d+z), y' = y·d/(d+z). Quanto maior z
(mais longe), menor a escala, criando o efeito de profundidade com um único ponto de
fuga. A distância d é ajustável por slider (padrão 10).

## Polígono — Etapa 4

Liga cada vértice ao próximo com `bresenham()`, como a polilinha, mas fecha a figura
ligando o último vértice de volta ao primeiro — essa aresta extra é o que diferencia
o polígono da polilinha. Também é a primitiva reutilizada pelas três transformações
abaixo, para desenhar a geometria original e a transformada.

## Matrizes homogêneas 3×3 (base da Etapa 4)

Cada transformação 2D vira uma matriz 3×3. Transformações compostas (escala/rotação
em torno de um ponto que não é a origem) são obtidas multiplicando as matrizes entre
si numa única matriz antes de tocar em qualquer vértice — `aplicarMatriz()` roda uma
vez por ponto, nunca as transformações em sequência ponto a ponto.

## Translação — Etapa 4

Desloca cada vértice do polígono por (dx, dy) aplicando uma única matriz homogênea de
translação a cada ponto. Polígono original em cor clara, transformado em cor forte.

## Escala em torno de ponto fixo — Etapa 4

Como a matriz de escala só funciona corretamente em torno da origem, compõe-se
T(+fixo) · Escala(sx,sy) · T(-fixo) por multiplicação de matrizes antes de aplicar a
cada vértice.

## Rotação em torno de pivô — Etapa 4

Mesma lógica da escala: compõe-se T(+pivô) · Rotação(ângulo) · T(-pivô) numa única
matriz. Ângulos negativos giram no sentido horário, sem nenhum caso especial no
código — `Math.cos`/`Math.sin` já tratam isso.

## Elipse (ponto médio, 2 regiões) — Etapa 5

Assim como o círculo, usa um critério de decisão para caminhar pixel a pixel, mas a
elipse precisa de duas regiões porque a curvatura muda: a região 1 vai de x=0 até o
ponto em que a inclinação da tangente cruza -1, e a região 2 cobre o resto até y=0.
Cada ponto calculado é replicado nos 4 quadrantes por simetria em torno do centro.

## Recorte de linha — Cohen-Sutherland — Etapa 5

Classifica os dois extremos da reta com um código de região de 4 bits (esquerda,
direita, baixo, cima da janela) e, enquanto a reta não está trivialmente dentro nem
trivialmente fora, substitui o extremo fora da janela pela interseção com a aresta
correspondente, repetindo até sobrar só o trecho visível (ou nada). A janela aparece
numa cor própria, a reta original em cor clara e o trecho recortado em cor forte.

## Recorte de polígono — Sutherland-Hodgman — Etapa 5

Recorta a lista de vértices contra cada uma das 4 arestas da janela em sequência
(esquerda, direita, baixo, cima); em cada passagem, decide aresta a aresta do
polígono se mantém o vértice, insere o ponto de interseção, ou descarta — o
resultado de uma passagem vira a entrada da próxima.

## Preenchimento — flood fill com pilha explícita — Etapa 5

A partir de uma semente interna, empilha os 4 vizinhos de cada célula pintada e
continua até a pilha esvaziar — nunca por recursão, que estouraria a pilha de
chamadas em regiões grandes. Consulta a matriz booleana `pintado[][]` (nunca lê
pixels de volta do canvas) para saber onde parar: se a célula já está pintada, é
fundo já preenchido ou borda.
