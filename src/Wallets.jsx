import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";
import { FiCopy } from "react-icons/fi";

const WalletCard = ({
  walletType,
  publicKey,
  privateKey,
  fullPublicKey,
  fullPrivateKey,
  onDelete,
}) => {
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="border p-4 mb-4 w-80 bg-zinc-800 m-3 rounded-md shadow-md">
      <div
        className={`font-semibold text-center text-xl ${
          walletType === "ETH" ? "text-yellow-500" : "text-pink-900"
        }`}
      >
        {walletType}
        <FiCopy
          className="cursor-pointer text-gray-600 ml-2"
          onClick={() =>
            copyToClipboard(
              walletType === "ETH" ? fullPublicKey : fullPrivateKey
            )
          }
        />
      </div>
      <div className="mt-3">
        <div className="border rounded-md bg-zinc-900 p-2 mb-2">
          <p className="text-xl">Public Key:</p>
          <div className="text-sm">{publicKey}</div>
        </div>
        <div className="border p-2 rounded-md bg-zinc-900 mb-2">
          <p className="text-xl">Private Key:</p>
          <div className="text-sm">{privateKey}</div>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="bg-red-500 rounded-md text-white p-2 mt-2 w-full"
      >
        Delete
      </button>
    </div>
  );
};

const Wallets = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [mnemonic, setMnemonic] = useState(localStorage.getItem("mnemonic"));

  useEffect(() => {
    const handleStorageChange = () => {
      setMnemonic(localStorage.getItem("mnemonic"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const genSolwallet = () => {
    if (!mnemonic) {
      alert("GET MNEMONIC FIRST");
      return;
    }
    const seed = mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    const publicKey = keypair.publicKey.toBase58();
    const privateKey = keypair.secretKey.toString("base64");

    localStorage.setItem(`solPublicKey_${currentIndex}`, publicKey);
    localStorage.setItem(`solPrivateKey_${currentIndex}`, privateKey);

    setCurrentIndex(currentIndex + 1);
    setWallets([
      ...wallets,
      {
        type: "SOL",
        publicKey,
        privateKey,
        fullPublicKey: publicKey,
        fullPrivateKey: privateKey,
      },
    ]);
  };

  const genEthWallet = async () => {
    if (!mnemonic) {
      alert("GET MNEMONIC FIRST");
      return;
    }
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);

    const publicKey = wallet.address;

    localStorage.setItem(`ethPublicKey_${currentIndex}`, publicKey);
    localStorage.setItem(`ethPrivateKey_${currentIndex}`, privateKey);

    setCurrentIndex(currentIndex + 1);
    setWallets([
      ...wallets,
      {
        type: "ETH",
        publicKey,
        privateKey,
        fullPublicKey: publicKey,
        fullPrivateKey: privateKey,
      },
    ]);
  };

  const deleteWallet = (index) => {
    const updatedWallets = wallets.filter((_, i) => i !== index);
    setWallets(updatedWallets);

    localStorage.removeItem(`solPublicKey_${index}`);
    localStorage.removeItem(`solPrivateKey_${index}`);
    localStorage.removeItem(`ethPublicKey_${index}`);
    localStorage.removeItem(`ethPrivateKey_${index}`);
  };

  const formatKey = (key) => {
    return key ? key.slice(0, 20) + "..." : "";
  };

  return (
    <div className="min-h-screen p-10 text-3xl font-bold flex flex-col items-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center mb-5">
        <div>Select Wallet To Generate</div>
        <div className="flex space-x-4">
          <button
            onClick={genSolwallet}
            className="bg-pink-900 rounded-md px-3 py-1 text-xl h-9 w-40"
          >
            SOLANA
          </button>
          <button
            onClick={genEthWallet}
            className="bg-yellow-500 rounded-md px-3 py-1 text-xl h-9 w-40"
          >
            ETH
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        {wallets.map((wallet, index) => (
          <WalletCard
            key={index}
            walletType={wallet.type}
            publicKey={formatKey(wallet.publicKey)}
            privateKey={formatKey(wallet.privateKey)}
            fullPublicKey={wallet.fullPublicKey}
            fullPrivateKey={wallet.fullPrivateKey}
            onDelete={() => deleteWallet(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Wallets;
