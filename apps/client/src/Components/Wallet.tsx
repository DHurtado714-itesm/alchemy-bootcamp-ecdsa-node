import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";
import { useState, ChangeEvent } from "react";
import server from "../service";

interface WalletProps {
  setAddress: (address: string) => void;
  setBalance: (balance: number) => void;
  setPrivateKey: (key: string) => void;
}

const Wallet: React.FC<WalletProps> = ({
  setAddress,
  setBalance,
  setPrivateKey,
}) => {
  const [privateKey, setLocalPrivateKey] = useState("");

  const onChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const key = evt.target.value;
    setLocalPrivateKey(key);
    setPrivateKey(key);

    const publicKey = secp256k1.getPublicKey(key);
    const address = `0x${toHex(keccak256(publicKey).slice(-20))}`;
    setAddress(address);

    if (address) {
      const response = await server.get(`balance/${address}`);
      setBalance(response.data.balance);
    }
  };

  return (
    <div>
      <label>
        Private Key
        <input type="text" value={privateKey} onChange={onChange} />
      </label>
    </div>
  );
};

export default Wallet;
