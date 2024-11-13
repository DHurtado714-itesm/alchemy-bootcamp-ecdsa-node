import { ChangeEvent } from "react";
import server from "../service";

interface WalletProps {
  address: string;
  setAddress: (address: string) => void;
  balance: number;
  setBalance: (balance: number) => void;
}

function Wallet({ address, setAddress, balance, setBalance }: WalletProps) {
  async function onChange(evt: ChangeEvent<HTMLInputElement>) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
