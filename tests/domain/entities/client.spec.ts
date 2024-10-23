import { Client } from "../../../src/domain/entities/client";
import { Transaction } from "../../../src/domain/entities/transaction";

describe("Client", () => {
  describe("hasBalance", () => {
    describe("when client has balance", () => {
      describe("and is a meal transaction", () => {
        it("returns true", () => {
          const client = new Client({
            id: "1",
            foodBalance: 0,
            mealBalance: 20,
            cashBalance: 0,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5811",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeTruthy();
          expect(client.toDto().mealBalance).toEqual(10);
        });
      });

      describe("and is a food transaction", () => {
        it("returns true", () => {
          const client = new Client({
            id: "1",
            foodBalance: 20,
            mealBalance: 0,
            cashBalance: 0,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5411",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeTruthy();
          expect(client.toDto().foodBalance).toEqual(10);
        });
      });

      describe("and is a cash transaction", () => {
        it("returns true", () => {
          const client = new Client({
            id: "1",
            foodBalance: 0,
            mealBalance: 0,
            cashBalance: 20,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5011",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeTruthy();
          expect(client.toDto().cashBalance).toEqual(10);
        });
      });
    });

    describe("when client has no balance and no fallback", () => {
      describe("and is a meal transaction", () => {
        it("returns false", () => {
          const client = new Client({
            id: "1",
            foodBalance: 0,
            mealBalance: 0,
            cashBalance: 0,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5811",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeFalsy();
          expect(client.toDto().mealBalance).toEqual(0);
          expect(client.toDto().cashBalance).toEqual(0);
        });
      });

      describe("and is a food transaction", () => {
        it("returns false", () => {
          const client = new Client({
            id: "1",
            foodBalance: 0,
            mealBalance: 0,
            cashBalance: 0,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5411",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeFalsy();
          expect(client.toDto().foodBalance).toEqual(0);
          expect(client.toDto().cashBalance).toEqual(0);
        });
      });

      describe("and is a cash transaction", () => {
        it("returns false", () => {
          const client = new Client({
            id: "1",
            foodBalance: 0,
            mealBalance: 0,
            cashBalance: 0,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5011",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeFalsy();
          expect(client.toDto().cashBalance).toEqual(0);
        });
      });
    });

    describe("when client has no balance and fallback", () => {
      describe("and is a meal transaction", () => {
        it("returns true", () => {
          const client = new Client({
            id: "1",
            foodBalance: 0,
            mealBalance: 5,
            cashBalance: 20,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5811",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeTruthy();
          expect(client.toDto().mealBalance).toEqual(5);
          expect(client.toDto().cashBalance).toEqual(10);
        });
      });

      describe("and is a food transaction", () => {
        it("returns true", () => {
          const client = new Client({
            id: "1",
            foodBalance: 5,
            mealBalance: 0,
            cashBalance: 20,
            transactions: [],
          });
          const transaction = new Transaction({
            id: "123",
            amount: 10,
            merchant: "Teste",
            mcc: "5411",
          });

          const res = client.hasBalance(transaction);

          expect(res).toBeTruthy();
          expect(client.toDto().foodBalance).toEqual(5);
          expect(client.toDto().cashBalance).toEqual(10);
        });
      });
    });
  });

  describe("getRealMcc", () => {
    describe("when merchant exists on map and mcc is incorrect", () => {
      it("returns correct mcc", () => {
        const client = new Client({
          id: "1",
          foodBalance: 0,
          mealBalance: 0,
          cashBalance: 0,
          transactions: [],
        });

        const transaction = new Transaction({
          id: "123",
          amount: 10,
          merchant: "UBER EATS                   SAO PAULO BR",
          mcc: "9999",
        });

        const mcc = client["getRealMcc"](transaction);
        expect(mcc).toEqual("5811");
      });
    });
    
    describe("when merchant exists on map and mcc is correct", () => {
      it("returns original mcc", () => {
        const client = new Client({
          id: "1",
          foodBalance: 0,
          mealBalance: 0,
          cashBalance: 0,
          transactions: [],
        });

        const transaction = new Transaction({
          id: "123",
          amount: 10,
          merchant: "UBER EATS                   SAO PAULO BR",
          mcc: "9999",
        });

        const mcc = client["getRealMcc"](transaction);
        expect(mcc).toEqual("5811");
      });
    });
    
    describe("when merchant do not exists on map", () => {
      it("returns original MCC", () => {
        const client = new Client({
          id: "1",
          foodBalance: 0,
          mealBalance: 0,
          cashBalance: 0,
          transactions: [],
        });

        const transaction = new Transaction({
          id: "123",
          amount: 10,
          merchant: "UNKNOWN MERCHANT",
          mcc: "1234",
        });

        const mcc = client["getRealMcc"](transaction);
        expect(mcc).toEqual("1234");
      });
    });
  });
});
