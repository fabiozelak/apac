# Site APAC - HTML/CSS/JavaScript

Site moderno e responsivo da Associação dos Pais e Amigos dos Patinadores Artísticos de Curitiba, desenvolvido com HTML, CSS e JavaScript puro.

## Características

- **Design Moderno**: Interface limpa com gradientes e animações suaves
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Performance Otimizada**: Carregamento rápido sem dependências pesadas
- **Fácil Manutenção**: Código simples e bem documentado
- **Acessível**: Estrutura semântica e navegação por teclado

## Estrutura do Projeto

```
apac-html-js/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript para interatividade
├── assets/             # Imagens e recursos
│   └── team_photo.webp # Foto da equipe
├── .nojekyll          # Arquivo para GitHub Pages
└── README.md          # Este arquivo
```

## Como Fazer Deploy no GitHub Pages

### Opção 1: Upload Manual

1. **Crie um repositório no GitHub**
   - Acesse [GitHub](https://github.com) e faça login
   - Clique em "New repository"
   - Nomeie como `apac` (ou outro nome de sua preferência)
   - Marque como público
   - Clique em "Create repository"

2. **Faça upload dos arquivos**
   - Clique em "uploading an existing file"
   - Arraste todos os arquivos desta pasta para o GitHub
   - Escreva uma mensagem de commit como "Adicionar site da APAC"
   - Clique em "Commit changes"

3. **Ative o GitHub Pages**
   - Vá para Settings > Pages
   - Em "Source", selecione "Deploy from a branch"
   - Escolha "main" branch e "/ (root)"
   - Clique em "Save"

4. **Acesse seu site**
   - O site estará disponível em: `https://SEU_USUARIO.github.io/apac/`

### Opção 2: Git Command Line

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/apac.git
cd apac

# Copie os arquivos para o repositório
cp -r /caminho/para/apac-html-js/* .

# Adicione e commit os arquivos
git add .
git commit -m "Adicionar site da APAC"
git push origin main
```

## Personalização

### Cores
As cores principais estão definidas no CSS usando gradientes:
- Azul: `#3b82f6`
- Roxo: `#8b5cf6`
- Verde: `#10b981`
- Rosa: `#ec4899`

### Conteúdo
Para alterar textos e informações, edite o arquivo `index.html`.

### Estilos
Para modificar o design, edite o arquivo `styles.css`.

### Funcionalidades
Para adicionar ou modificar interações, edite o arquivo `script.js`.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Interatividade e animações
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Inter)

## Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móveis (iOS/Android)

## Suporte

Para dúvidas ou sugestões sobre o site, entre em contato através dos canais oficiais da APAC.
