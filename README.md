# Cassia Guimarães — Social Media | Storymaker

Site estático responsivo. Para visualizar localmente, abra `index.html` no navegador ou execute um servidor local nesta pasta (por exemplo: `python -m http.server 8000`).

## Estrutura
- `index.html`: conteúdo e seções do site.
- `styles.css`: identidade visual, layout e responsividade.
- `script.js`: menu, filtros das galerias e visualizador de fotos/vídeos.
- `assets/fotos/`: fotos de apresentação da Cassia já presentes na versão-base.
- `assets/portfolio/`: mídias reais organizadas por categoria, com imagens completas, miniaturas e vídeos.

## Portfólio
As quatro categorias são **Casamentos**, **Aniversários**, **Ensaios profissionais** e **Ensaio**. As fotos são servidas em WebP com miniaturas independentes. Os vídeos só recebem `src` quando a pessoa seleciona uma prévia.

Os cinco vídeos foram convertidos para MP4/H.264. O vídeo de aniversário, originalmente em 4K e com cerca de 421 MB, foi otimizado para 540 × 960 px a 20 fps, mantendo sua duração completa; os outros quatro foram otimizados para até 720 × 1280 px ou 1280 × 720 px a 24 fps. O visualizador oferece uma alternativa para abrir o arquivo caso o navegador não consiga reproduzir algum vídeo.

## Publicação
Envie a pasta completa `Cassia-Guimaraes-Site` para a hospedagem, mantendo a estrutura de diretórios. Não renomeie nem mova os arquivos dentro de `assets/`.

## Compatibilidade móvel

A versão inclui ajustes de largura para evitar rolagem horizontal involuntária, áreas seguras do iPhone, correções de rolagem do visualizador de mídia no Safari e alternativas para recursos CSS em navegadores móveis mais antigos.
