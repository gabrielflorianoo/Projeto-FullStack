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

1. Inicie o projeto com "npm start"
2. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a aplicação.
3. Clique no botão com um ícone de chave na barra de navegação para inserir sua API Key.
4. Após inserir a API Key, clique no botão "Converter moedas" para iniciar a conversão de moedas.
5. Selecione a moeda alvo e insira o valor a ser convertido no campo de texto.
6. Clique no botão "Converter" ou "Iniciar conversão automática" para converter o valor.

# A Fazer para a Segunda Parte do Projeto

Com a adição do backend, planejamos implementar as seguintes funcionalidades para melhorar e expandir o sistema:

1. **Histórico de Conversões**
   - Salvar as conversões realizadas pelo usuário, incluindo:
     - Data e hora.
     - Valor em EUR inserido.
     - Moeda alvo.
     - Taxa de câmbio utilizada.
   - Permitir que o usuário visualize e filtre este histórico (por data ou moeda).

2. **Sistema de Usuários e Preferências**
   - Implementar perfis de usuário que possibilitem:
     - Salvar moedas favoritas para acesso rápido.
     - Fazer um novo sistema para moedas favoritas.

3. **Conversão em Lote**
   - Adicionar funcionalidade para upload de arquivos (como CSV) contendo vários valores para conversão.
   - Permitir o download dos resultados como arquivo no formato escolhido pelo usuário.

4. **Relatórios Personalizados**
   - Permitir a geração de relatórios baseados no histórico de conversões:
     - Exportação para PDF ou Excel.
     - Visualização de gráficos, como flutuações de taxas de câmbio (usando dados históricos).

5. **Integração com Banco de Dados**
   - Usar o backend para armazenar:
     - Histórico de conversões.
     - Estatísticas de uso (moedas mais convertidas, número total de conversões etc.).
     - Logs de acesso para fins de auditoria e análise.

6. **API Interna**
   - Criar uma API interna que permita:
     - Gerenciar funcionalidades como conversões, acesso ao histórico e configurações de usuário.
     - Uso por outras aplicações que precisem realizar conversões de moeda.

7. **Controle de Taxas de API**
   - Implementar um sistema de monitoramento para gerenciar o uso da API do Fixer.io, evitando ultrapassar os limites do plano gratuito.
   - Cachear as taxas de câmbio no backend para reduzir chamadas repetidas à API.
