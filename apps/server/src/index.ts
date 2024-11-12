import express from "express";
import cors from "cors";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances: Record<string, number> = {
  "0x03f65b652d1c6cc70b477f85703088371d2fbc1d34f5862ebd5e83978d702e1ff2": 100,
  "0x025912ebeedfd545c19ab4db489285e8f11e2bea1be1057a89ba7b4db889b5794e": 50,
  "0x039edab872ad6c5397248c2e6dd8013c4796f13bf19cd101575e5778692a9b429b": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit } = req.body;
  const messageHash = keccak256(
    Uint8Array.from([...Buffer.from(sender + recipient + amount.toString())])
  );

  const publicKey = secp256k1.recoverPublicKey(
    messageHash,
    Uint8Array.from(signature),
    recoveryBit
  );
  const derivedAddress = `0x${toHex(keccak256(publicKey).slice(-20))}`;

  if (derivedAddress !== sender) {
    return res.status(400).send({ message: "Invalid signature!" });
  }

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  }

  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
