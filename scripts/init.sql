DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS transaction;

CREATE TABLE client(
  id TEXT PRIMARY KEY NOT NULL,
  food_balance REAL NOT NULL,
  meal_balance REAL NOT NULL,
  cash_balance REAL NOT NULL
);

CREATE TABLE transaction(
  id TEXT PRIMARY KEY NOT NULL,
  amount REAL NOT NULL,
  merchant TEXT NOT NULL,
  mcc TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES client(id)
);

INSERT INTO client (id, food_balance, meal_balance, cash_balance)
VALUES ('1', 71.84, 36.10, 83.78);

INSERT INTO client (id, food_balance, meal_balance, cash_balance)
VALUES ('2', 22.84, 58.06, 23.13);
