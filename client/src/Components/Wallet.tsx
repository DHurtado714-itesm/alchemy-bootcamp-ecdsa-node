import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";
import { useState, ChangeEvent } from "react";
import server from "../service";

interface WalletProps {
  address: string;
  setAddress: (address: string) => void;
  balance: number;
  setBalance: (balance: number) => void;
  privateKey: string;
  setPrivateKey: (key: string) => void;
}

const Wallet: React.FC<WalletProps> = ({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) => {
  const [localPrivateKey, setLocalPrivateKey] = useState(privateKey);

  const onChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const key = evt.target.value;
    setLocalPrivateKey(key);
    setPrivateKey(key);

    try {
      // Convert private key to Uint8Array before passing to getPublicKey
      const publicKey = secp256k1.getPublicKey(hexToBytes(key));
      const derivedAddress = `0x${toHex(keccak256(publicKey).slice(-20))}`;
      setAddress(derivedAddress);

      if (derivedAddress) {
        const response = await server.get(`balance/${derivedAddress}`);
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Invalid private key", error);
      setAddress("");
      setBalance(0);
    }
  };

  return (
    <div>
      <label>
        Private Key
        <input type="text" value={localPrivateKey} onChange={onChange} />
      </label>
      <div>Address: {address}</div>
      <div>Balance: {balance}</div>
    </div>
  );
};

export default Wallet;
