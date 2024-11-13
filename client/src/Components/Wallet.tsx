import { ChangeEvent, useEffect } from "react";
import server from "../service";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

interface WalletProps {
  address: string;
  setAddress: (address: string) => void;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
  balance: number;
  setBalance: (balance: number) => void;
}

function Wallet({
  address,
  setAddress,
  privateKey,
  setPrivateKey,
  balance,
  setBalance,
}: WalletProps) {
  async function onChange(evt: ChangeEvent<HTMLInputElement>) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = secp256k1.getPublicKey(privateKey);
    setAddress(toHex(publicKey));
  }

  useEffect(() => {
    async function fetchBalance() {
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
    fetchBalance();
  }, [address, setBalance]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type your private key:"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
