# Algoritmos de Síntese de Imagem

Aplicação com interface gráfica que implementa, do zero, algoritmos clássicos de
rasterização (síntese de imagem). Toda a saída dos algoritmos passa por uma única
função de baixo nível, `setPixel(x, y, cor)` — nenhuma primitiva pronta do Canvas
(`lineTo`, `stroke`, `arc`, `ellipse`, `fill`, `bezierCurveTo` etc.) é usada para
desenhar geometria. Primitivas nativas só desenham a grade, os eixos e os rótulos.

## Autores

Antonio Roger Morais, Polyana Moraes

## Como executar

Abra um terminal na pasta do projeto e rode:

```bash
npm start
```

Depois acesse no navegador:

```text
http://localhost:3000
```

Também é possível rodar diretamente com Node:

```bash
node servidor.js
```

Não há build nem dependências externas: o servidor local apenas entrega os arquivos
HTML, CSS e JavaScript do projeto.

## Algoritmos implementados

| Algoritmo | Seção do código |
|---|---|
| Reta (Bresenham) | [js/algoritmos/reta.js](js/algoritmos/reta.js) |
| Polilinha | [js/algoritmos/polilinha.js](js/algoritmos/polilinha.js) |
| Polígono | [js/algoritmos/poligono.js](js/algoritmos/poligono.js) |
| Bézier grau 2 | [js/algoritmos/bezierQuadratica.js](js/algoritmos/bezierQuadratica.js) |
| Bézier grau 3 | [js/algoritmos/bezierCubica.js](js/algoritmos/bezierCubica.js) |
| Círculo (ponto médio) | [js/algoritmos/circunferencia.js](js/algoritmos/circunferencia.js) |
| Elipse (ponto médio, 2 regiões) | [js/algoritmos/elipse.js](js/algoritmos/elipse.js) |
| Preenchimento (flood fill) | [js/algoritmos/preenchimento.js](js/algoritmos/preenchimento.js) |
| Recorte de linha (Cohen-Sutherland) | [js/algoritmos/recorteLinha.js](js/algoritmos/recorteLinha.js) |
| Recorte de polígono (Sutherland-Hodgman) | [js/algoritmos/recortePoligono.js](js/algoritmos/recortePoligono.js) |
| Translação | [js/algoritmos/translacao.js](js/algoritmos/translacao.js) |
| Escala em torno de ponto fixo | [js/algoritmos/escala.js](js/algoritmos/escala.js) |
| Rotação em torno de pivô | [js/algoritmos/rotacaoPivo.js](js/algoritmos/rotacaoPivo.js) |
| Cubo 3D — dados/rotação compartilhados | [js/algoritmos/cubo.js](js/algoritmos/cubo.js) |
| Projeção ortogonal | [js/algoritmos/projecaoOrtogonal.js](js/algoritmos/projecaoOrtogonal.js) |
| Projeção oblíqua (cavalier/cabinet) | [js/algoritmos/projecaoObliqua.js](js/algoritmos/projecaoObliqua.js) |
| Projeção perspectiva (1 ponto de fuga) | [js/algoritmos/projecaoPerspectiva.js](js/algoritmos/projecaoPerspectiva.js) |

Infraestrutura de apoio (grade, coordenadas, matrizes, validação) fica em `js/core/`;
o painel dinâmico, o catálogo de algoritmos e a interação com o mouse ficam em `js/ui/`.

## Observações sobre decisões de implementação

- **`setPixel` + matriz `pintado[22][22]`**: todo algoritmo termina nessa função —
  ela pinta a célula no canvas *e* marca a matriz booleana, que o preenchimento
  consulta para achar bordas em vez de ler pixels de volta do canvas.
- **Scripts clássicos, não módulos ES**: `type="module"` é bloqueado por CORS ao
  abrir um arquivo via `file://` no Chrome. Por isso os `<script src>` em
  `index.html` são clássicos e compartilham escopo global — a ordem deles importa.
- **Cores compartilhadas** (`js/core/config.js`): `COR_PONTOS_CONTROLE` (pontos de
  entrada/controle), `COR_POLIGONO_CONTROLE` (geometria auxiliar/original, mais
  clara) e `COR_JANELA_RECORTE` mantêm a mesma convenção visual em todos os
  algoritmos, em vez de cada um inventar sua própria cor.
- **Composição de matrizes antes de aplicar aos pontos** (Etapa 4): escala e
  rotação com pivô multiplicam `T(+p) · M · T(-p)` numa única matriz 3×3 e só
  então chamam `aplicarMatriz` em cada vértice — nunca transladam, transformam e
  transladam de volta ponto a ponto em sequência.
- **Preenchimento sem recursão**: usa uma pilha explícita (`array` + `while`) para
  não estourar a pilha de chamadas em regiões grandes.
- **Círculo e elipse não destacam o centro**: os demais algoritmos marcam pontos de
  entrada/controle com `setPixel`, mas o centro é o ponto mais natural para semear
  o preenchimento — marcá-lo deixaria essa célula "ocupada" e bloquearia a semente
  mais óbvia.
- **Entrada dupla**: campos numéricos digitáveis e clique na grade preenchem os
  mesmos campos, na ordem em que aparecem no painel; algoritmos com número
  variável de vértices (polilinha, polígono, recorte de polígono) usam um campo de
  texto único no formato `x,y; x,y; ...`, também preenchido por clique.
- **Scanline não implementado**: o preenchimento cobre a alternativa "semente
  interna + pilha"; a varredura por lista de arestas ativas, oferecida como opção
  no enunciado, ficou de fora por escopo.
