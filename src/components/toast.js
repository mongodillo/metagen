import React, { useState, useEffect, useCallback } from "react";
import parse from "html-react-parser";

const Toast = (props) => {
  const { toastList, toastProcessList } = props;
  const [list, setList] = useState(toastList);
  const [processList, setProcessList] = useState(toastProcessList);

  const closeToast = useCallback(
    (i) => {
      list.splice(i, 1);
      setList([...list]);
    },
    [list]
  );

  const closeProcessToast = useCallback(
    (id) => {
      const index = processList.findIndex((e) => e.id === id);
      processList.splice(index, 1);
      setProcessList([...processList]);
    },
    [processList]
  );

  useEffect(() => {
    setList(toastList);
  }, [toastList, list]);

  useEffect(() => {
    setProcessList(toastProcessList);
  }, [toastList, toastProcessList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (toastList.length && list.length) {
        closeToast(0);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [closeToast, list, toastList]);

  return (
    <div className="box-border fixed z-999  w-1/2 md:w-1/3 2xl:w-1/4 bottom-8 right-3 ">
      {list.map((toast, i) => (
        <div
          key={`toast/${i}`}
          className={` alert ${toast.type} shadow-lg my-2 flex-row justify-start transform animate-toast-in-right transition ease-in-out`}
        >
          <div className=" flex flex-row w-11/12">
            {toast.status !== "processing" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={` stroke-current flex-shrink-0 w-8 h-8`}>
                {toast.status === "info" && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
                {toast.status === "success" && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
                {toast.status === "error" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
                {toast.status === "warning" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                )}
              </svg>
            )}
            <div className="flex flex-col">
              <h1 className=" font-bold capitalize"> {toast.status}</h1>
              <div className="break-words">{parse(toast.message)}</div>
            </div>
          </div>
          <div className="flex-none">
            <button
              className="btn  btn-xs btn-link self-start hover:scale-125 "
              onClick={() => {
                closeToast(i);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${toast.type} h-6 w-6 stroke-current `} fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      {processList.map((toast, i) => (
        <div
          key={`toast/${i}`}
          className={` alert alert-info shadow-lg my-2 flex-row justify-start transform animate-toast-in-right transition ease-in-out`}
        >
          <div className=" flex flex-row w-11/12">
            {toast.status === "processing" && (
              <svg
                role="status"
                className="mr-2 flex-shrink-0 w-8 h-8 text-info-content animate-spinslow fill-info"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            <div className="flex flex-col">
              <h1 className=" font-bold capitalize"> {toast.status}</h1>
              <div className="break-words">{parse(toast.message)}</div>
            </div>
          </div>
          <div className="flex-none">
            <button
              className="btn  btn-xs btn-link self-start hover:scale-125 "
              onClick={() => {
                closeProcessToast(toast.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`alert-info h-6 w-6 stroke-current `} fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
