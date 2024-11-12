import { useState, useEffect } from "react";
import { generateMnemonic } from "bip39";

const SecretPhrase = () => {
  const [mnemonicWords, setMnemonicWords] = useState([]);
  const [isHovered, setIsHovered] = useState(Array(12).fill(false));

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    if (storedMnemonic) {
      setMnemonicWords(storedMnemonic.split(" "));
    }
  }, []);

  const generateSeedPhrase = async () => {
    const mnemonic = await generateMnemonic();
    const words = mnemonic.split(" ");
    setMnemonicWords(words);
    setIsHovered(Array(words.length).fill(false));

    localStorage.setItem("mnemonic", mnemonic);
  };

  const deleteSeedPhrase = () => {
    setMnemonicWords([]);
    setIsHovered(Array(12).fill(false));
    localStorage.removeItem("mnemonic");
  };

  return (
    <div className="h-screen bg-zinc-950 flex flex-col justify-center items-center">
      <div className="p-10 text-3xl font-bold flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center mb-5">
          <div className="text-white">Create Your Secret Phrase</div>
          <div>
            <button
              onClick={generateSeedPhrase}
              className="bg-blue-700  border-blue-500 rounded-md px-3 py-1 text-xl m-3 h-9 w-40"
            >
              Generate
            </button>

            {mnemonicWords.length > 0 && (
              <button
                onClick={deleteSeedPhrase}
                className="bg-red-500 border-red-500 rounded-md px-3 py-1 text-xl m-3 h-9 w-40"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        {mnemonicWords.length == 0 && (
          <div className="text-blue-400">
            Please Click on generate button & Scroll Down to get Wallet :
          </div>
        )}
        {mnemonicWords.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {mnemonicWords.map((word, index) => (
              <div
                key={index}
                className="bg-gray-200 text-black border border-gray-400 rounded-md shadow-md px-4 py-3 flex items-center gap-2"
                style={{ width: "200px" }}
                onMouseEnter={() =>
                  setIsHovered((prev) => {
                    const updatedHovered = [...prev];
                    updatedHovered[index] = true;
                    return updatedHovered;
                  })
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => {
                    const updatedHovered = [...prev];
                    updatedHovered[index] = false;
                    return updatedHovered;
                  })
                }
              >
                <p className="tracking-widest">
                  {isHovered[index] ? word : "•••••••••"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretPhrase;
