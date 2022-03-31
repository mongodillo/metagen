import React, { useState, useEffect } from "react";
//import { IPFSProvider } from "./hooks/ipfs";
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

  const toggleDarkMode = () => {
    if (darkMode === "main") setDarkMode("maindark");
    else setDarkMode("main");
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const spinProps = { spinLoad, setSpinLoad };
  const toastProps = { setToastList, setToastProcessList, toastList, toastProcessList };

  return (
    <div data-theme={darkMode} className="font-sans bg-base-100 text-base-content  ">
      <div className=" sticky top-0 z-50 navbar pl-4  bg-primary  text-primary-content py-0 h-16">
        <div className="flex-1 font-bold text-3xl">RANDOM META GENERATOR</div>
        <ul tabIndex="0" className="  menu    ">
          <li className="  btn-ghost  border-0   border-primary-content h-16 max-h-16 min-h-16" onClick={() => toggleDarkMode()}>
            <div className="w-full flex items-center font-semibold  ">
              <svg className="fill-current w-10 h-10 " xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24">
                <path
                  className="scale-125"
                  d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
                />
              </svg>
              <span>Dark Mode</span>
              <input readOnly className="toggle toggle-info " type="checkbox" role="switch" checked={darkMode === "maindark" ? true : ""} />
            </div>
          </li>
        </ul>
      </div>
      <div className="min-h-screen">
        <Metagen {...{ ...toastProps, ...spinProps }} />
      </div>

      <Toast {...toastProps} />
      <SpinLoader spinLoad={spinLoad} />
      <footer className="footer footer-center p-10 bg-primary text-primary-content bottom-0">
        <div>
          Random Meta Generator v1 (2022)
          <div className="flex flex-row gap-2">
            mongodillo
            <a href="https://twitter.com/mongodillo" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Index() {
  return (
    // <IPFSProvider>
    <App />
    //</IPFSProvider>
  );
}
