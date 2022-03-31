import React, { useState, useEffect } from "react";
import { IPFSProvider } from "./hooks/ipfs";
import Metagen from "./pages/metagen";
import Toast from "./components/toast";
import SpinLoader from "./components/spinloader";

function App() {
  const [toastList, setToastList] = useState([]);
  const [toastProcessList, setToastProcessList] = useState([]);
  const [spinLoad, setSpinLoad] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      const initialValue = saved;
      return initialValue || "main";
    }
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const spinProps = { spinLoad, setSpinLoad };
  const themeProps = { darkMode, setDarkMode };
  const toastProps = { setToastList, setToastProcessList, toastList, toastProcessList };

  return (
    <div data-theme={darkMode} className="font-sans bg-base-100 text-base-content ">
      <div className=" sticky top-0 z-50 navbar pl-4  bg-primary  text-primary-content py-0 h-16">
        <div className="flex-1">RANDOM META GENERATOR</div>
        <div className="flex-none h-full gap-2">darkmode</div>
      </div>
      <Metagen {...{ ...toastProps, ...spinProps }} />
      <Toast {...toastProps} />
      <SpinLoader spinLoad={spinLoad} />
    </div>
  );
}

export default function Index() {
  return (
    <IPFSProvider>
      <App />
    </IPFSProvider>
  );
}
