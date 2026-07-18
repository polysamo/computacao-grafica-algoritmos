const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = process.env.PORT || 3000;
const RAIZ = __dirname;

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function resolverArquivo(url) {
  const caminhoUrl = decodeURIComponent(url.split('?')[0]);
  const caminhoRelativo = caminhoUrl === '/' ? 'index.html' : caminhoUrl.slice(1);
  const arquivo = path.normalize(path.join(RAIZ, caminhoRelativo));

  if (!arquivo.startsWith(RAIZ)) {
    return null;
  }

  return arquivo;
}

const servidor = http.createServer(function (req, res) {
  const arquivo = resolverArquivo(req.url);

  if (!arquivo) {
    res.writeHead(403);
    res.end('Acesso negado');
    return;
  }

  fs.readFile(arquivo, function (erro, conteudo) {
    if (erro) {
      res.writeHead(404);
      res.end('Arquivo nao encontrado');
      return;
    }

    const extensao = path.extname(arquivo);
    res.writeHead(200, {
      'Content-Type': tipos[extensao] || 'application/octet-stream'
    });
    res.end(conteudo);
  });
});

servidor.listen(PORTA, function () {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
  console.log('Pressione Ctrl+C para encerrar.');
});
