import { useState } from "react";
import server from "../service";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";

interface TransferProps {
  address: string;
  privateKey: string;
  setBalance: (balance: number) => void;
}

function Transfer({ address, privateKey, setBalance }: TransferProps) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue =
    (setter: (value: string) => void) =>
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setter(evt.target.value);

  async function transfer(evt: React.FormEvent) {
    evt.preventDefault();

    try {
      const messageHash = utf8ToBytes(
        JSON.stringify({
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
        })
      );

      // Generate signature before sending the request
      const signature = await secp256k1
        .sign(messageHash, privateKey)
        .toCompactHex();

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        /**
         * @warning 
         */
        privateKey,
      });
      setBalance(balance);
    } catch (ex) {
      if (ex instanceof Error) {
        alert(ex.message);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
