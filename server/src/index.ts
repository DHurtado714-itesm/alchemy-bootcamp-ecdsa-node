import { Request, Response } from "express";

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances: Record<string, number> = {
  "0304d3f1c68da1d2e5d2e0285c22d1d8c9334cfaeabd408dabff84179a97d4eb98": 100,
  "02adb814ed744b2d067d63461dfdec4e6169e6ead80f9fdd9f5457b6ced9c4619e": 50,
  "03b5e99bb20b02a88d8ead12a9e37feb9477c0e830475f5e4a69a2e9fa3a9439d3": 75,
};

app.get("/balance/:address", (req: Request, res: Response) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req: Request, res: Response) => {
  // TODO: get a signature from the client-side application
  // TODO: verify the signature
  // TODO: recover the public address from the signature

  try {
    const { sender, recipient, amount } = req.body;

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      res.status(400).send({ message: ex.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address: string) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
