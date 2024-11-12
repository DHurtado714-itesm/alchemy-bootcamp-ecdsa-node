import { useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import server from "../service";

interface TransferProps {
  address: string;
  privateKey: string;
  setBalance: (balance: number) => void;
}

const Transfer: React.FC<TransferProps> = ({
  address,
  privateKey,
  setBalance,
}) => {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const transfer = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const message = `${address}${recipient}${sendAmount}`;
    const messageHash = keccak256(utf8ToBytes(message));

    const [signature, recoveryBit] = secp256k1.sign(messageHash, privateKey, {
      recovered: true,
    });

    try {
      const response = await server.post("send", {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: Array.from(signature),
        recoveryBit,
      });
      setBalance(response.data.balance);
    } catch (ex: any) {
      alert(ex.response.data.message);
    }
  };

  return (
    <form onSubmit={transfer}>
      <label>
        Send Amount
        <input
          type="number"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
        />
      </label>
      <label>
        Recipient
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </label>
      <button type="submit">Transfer</button>
    </form>
  );
};

export default Transfer;
