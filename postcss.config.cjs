// Alterado para o formato CommonJS (module.exports) para melhor compatibilidade
// Renomeado para .cjs para ser compatível com "type": "module" no package.json
// ATUALIZADO: para usar o plugin @tailwindcss/postcss conforme a mensagem de erro
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- Alterado de 'tailwindcss'
    autoprefixer: {},
  },
}

