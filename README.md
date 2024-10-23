# Desafio Caju

Este projeto é a implementação do desafio de back-end da Caju.

## Execução do projeto 

1. Executar o comando `make up` na raiz do projeto
2. Ao subir o container do banco no Docker, ele é populado com os seguintes clientes: 

| id  | food_balance | meal_balance | cash_balance |
| --- | ------------ | ------------ | ------------ |
| 1   | 71.84        | 36.10        | 83.78        |
| 2   | 22.84        | 58.06        | 23.13        |

3. O servidor estará disponível em http://localhost:4001
4. Aqui está uma requisição de exemplo:
```
curl --request POST \
  --url http://localhost:4001/transaction \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.1.0' \
  --data '{
  "id": "423",
  "accountId": "1", 
  "amount": 80.00,
  "merchant": "UBER EATS                   SAO PAULO BR",
  "mcc": "5821"
}'
```

## Item 4 - Questão aberta

Para solucionar o problema das transações simultâneas, podemos utilizar um lock leve e implementar um sistema de semáforo. Esse sistema pode usar o Redis para armazenar os clientes que estão em processo de transação.

O *client-repository* seria responsável por essa comunicação com o Redis. No método `get`, verificaríamos o Redis procurando o id do cliente. Se o id não estiver presente, o cliente seria recuperado do banco de dados e o id seria adicionado ao Redis, evitando que outras transações modifiquem o saldo desse cliente. Após a conclusão da transação (no método `addTransaction`), removeríamos o id do Redis, tanto no caso de a transação ser bem-sucedida (cliente com saldo suficiente) quanto em caso de falha, através de uma chamada ao repositório. Esse mesmo método do repositório seria chamado pela *process-transaction-collaboration* no caso do cliente não possuir saldo suficiente e a transação for negada.

Caso o id já exista no Redis, o método `get` do repositório realizaria tentativas contínuas até que o id não esteja mais lá, indicando que a transação anterior foi finalizada.

Uma desvantagem dessa abordagem é que uma transação pode realizar diversas tentativas de consulta ao Redis, encontrando o id repetidamente, o que pode causar o estouro do limite de 100 ms para o processamento.
