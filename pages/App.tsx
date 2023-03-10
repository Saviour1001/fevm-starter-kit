import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "./api/fevmRPC";
// Adapters

const clientId =
  "BL205Omc9EDaNvgIY3-q6TgWJnWLqm-bVdGJd7QvZbaPZyEGIadxueB3C-YRvC1Ok5rr5m9TJvspkQ9lEi3htnI"; // get from https://dashboard.web3auth.io
// if you are hosting the project, you need to have a client id and whitelist your domain name in the dashboard
function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.OTHER,
            chainId: "3141",
            rpcTarget: "https://rpc.ankr.com/filecoin_testnet", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          uiConfig: {
            theme: "dark",
            loginMethodsOrder: ["facebook", "google"],
            appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
          },
        });
        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    uiConsole("Logged in Successfully!");
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance + " fil");
  };

  const sendFil = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const txHash = await rpc.sendFIL();
    uiConsole(txHash);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex flex-row w-full h-fit gap-5">
        <div>
          <button
            onClick={getAccounts}
            className="fevm-grad w-full h-20 text-xl px-3 py-1"
          >
            Get Accounts
          </button>
        </div>
        <div>
          <button
            onClick={getBalance}
            className="fevm-grad w-full h-20 text-xl px-3 py-1"
          >
            Get Balance
          </button>
        </div>
        <div>
          <button
            onClick={logout}
            className="fevm-grad w-full h-20 text-xl px-3 py-1"
          >
            Log Out
          </button>
        </div>
      </div>
      <div id="console" className="h-fit w-full">
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button
      onClick={login}
      className="fevm-grad rounded-full px-10 py-3 text-white text-lg font-semibold w-full mx-5"
    >
      LOGIN
    </button>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className=" flex flex-col justify-evenly items-center backdrop-blur-sm w-full h-full lg:h-3/4 lg:w-1/2 m-5 p-10 rounded-md border-2	 border-cyan-500/40 bg-black/20">
        <h1 className="title text-white">
          FEVM Dapp Scaffold<div className="text-cyan-300">NextJS</div>
        </h1>

        <div className="grid">{provider ? loggedInView : unloggedInView}</div>
      </div>
    </div>
  );
}

export default App;
