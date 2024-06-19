import Notification from "./components/Notification";
import io from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import { Context } from "./store/context";
import LiveOrder from "./components/LiveOrder";

const SOCKET = io(process.env.REACT_APP_SOCKET_SERVER);

function App() {
  const setSocketContext = useContext(Context).setSocket;

  const [isConnected, setIsConnected] = useState(SOCKET.connected);

  useEffect(() => {
    const handleConnectionSuccess = () => {
      setSocketContext(SOCKET);
      setIsConnected(true);
    };

    SOCKET.on("connection_sucess", handleConnectionSuccess);

    return () => {
      SOCKET.off("connection_sucess", handleConnectionSuccess);
    };
  }, [setSocketContext]);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    SOCKET.on("connect", handleConnect);
    SOCKET.on("disconnect", handleDisconnect);

    return () => {
      SOCKET.off("connect", handleConnect);
      SOCKET.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <main className="flex bg-secondary h-screen">
      <LiveOrder />
      {!isConnected && (
        <div className="backdrop-blur-lg fixed bottom-0 z-50 w-full bg-black/75 flex items-center justify-center">
          <span className="px-2 py-4 font-primary flex tracking-wide flex-row items-center gap-2 text-zinc-100 font-semibold text-lg">
            <span className="spinner"></span>
            Please wait for socket connection... (dev purpose only)
          </span>
        </div>
      )}
      <Notification />
    </main>
  );
}

export default App;
