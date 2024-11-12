import "./App.scss";
import { useState } from "react";
import Transfer from "./Components/Transfer";
import Wallet from "./Components/Wallet";

const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        privateKey={privateKey}
      />
    </div>
  );
};

export default App;
