![](coinvert.png) 
# Conversor de Moedas

Este é um projeto de conversão de moedas desenvolvido em React, que utiliza a API de conversão do [Fixer.io](https://fixer.io) para obter a taxa de câmbio mais recente e converter um valor em EUR para uma moeda alvo selecionada pelo usuário. Ele também usa o armazenamento local para guardar a taxa de câmbio e a moeda alvo da última conversão, otimizando o uso da API.

## Funcionalidades

- Conversão de valor em EUR para uma moeda alvo.
- Seleção de moeda alvo a partir de um dropdown com as opções disponíveis.
- Armazenamento local da última taxa de conversão e da moeda alvo, permitindo o uso da taxa salva quando o usuário retorna ao app.
- Exibição do valor convertido em uma interface amigável.

## Tecnologias Utilizadas

- **React**: Framework para a criação da interface.
- **Material-UI**: Biblioteca de componentes para a interface gráfica.
- **Axios**: Biblioteca para realizar as requisições HTTP.
- **LocalStorage**: Armazenamento local do navegador para salvar dados persistentes.
- **Fixer.io**: API de taxas de câmbio, utilizada para obter a taxa mais recente para conversão.

## Como Usar

1. Insira um valor em EUR no campo de entrada.
2. Selecione a moeda alvo no menu dropdown.
3. Clique no botão "Converter" para realizar a conversão.
4. O valor convertido será exibido abaixo.
