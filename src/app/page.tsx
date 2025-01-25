"use client";

import { Skeleton } from "@/components/Skeleton";
import { MAIN_CONTRACT } from "@/constant";
import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

function App() {
  const account = useAccount();
  const [tokenUri, setTokenUri] = useState<string>("");

  const {
    data: balanceOf,
    isLoading: balanceOfLoading,
    refetch,
  } = useReadContract({
    ...MAIN_CONTRACT,
    functionName: "balanceOf",
    args: [
      `${account.address || "0x0000000000000000000000000000000000000000"}`,
    ],
    chainId: sepolia.id,
  });

  const { data: hash, writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => {
        refetch();
        setTokenUri("");
      },
    },
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  function MintNft() {
    if (tokenUri.length !== 0) {
      writeContract({
        ...MAIN_CONTRACT,
        functionName: "mintNFT",
        args: [account.address, tokenUri],
        chainId: sepolia.id,
      });
    } else {
      toast.warning("you must fill tokenURI !");
    }
  }

  return (
    <main>
      <div>
        <header className="flex justify-end py-5 px-10">
          <ConnectKitButton />
        </header>
        <div className="lg:px-14 px-5 lg:font-medium font-normal lg:text-2xl text-xl flex flex-col gap-y-5">
          <div>status: {account.status}</div>
          <div>addresses: {JSON.stringify(account.addresses)}</div>
          <div>chainId: {account.chainId}</div>
          <div className="flex gap-x-4 items-center">
            <span>Your Balance is :</span>
            {balanceOfLoading ? (
              <Skeleton className="w-12 h-8 rounded-md bg-slate-500" />
            ) : (
              <>{balanceOf?.toString()}</>
            )}
          </div>
          <div className="flex items-center gap-x-6">
            <input
              onChange={(e) => setTokenUri(e.target.value)}
              value={tokenUri}
              placeholder="TokenUri"
              className="border border-slate-600 px-2 rounded-sm py-2"
            />
            <button
              onClick={MintNft}
              className="bg-green-700 cursor-pointer hover:bg-green-600 transition-all duration-200 ease-out rounded-md py-3 px-4 text-white w-1/8 min-w-40"
              disabled={isConfirming}
            >
              {isConfirming
                ? "Confirming..."
                : isError
                  ? "Error Happend!"
                  : isConfirmed
                    ? "Confirmed Successfully"
                    : "Mint"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
