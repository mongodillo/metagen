import React from "react";

const Metaloader = ({ isLoading, loadingWidth }) => {
  return (
    <>
      <div className={`modal ${isLoading ? "modal-open" : ""}`}>
        <div className="modal-box   shadow-none bg-transparent border-0">
          <div className="w-full mb-3 bg-gray-200 rounded-full h-6 dark:bg-gray-700">
            <div
              className="bg-primary animate-pulse text-sm font-medium h-6 text-primary-content text-center p-1 leading-none rounded-full"
              style={{ width: `${loadingWidth}%` }}
            >
              {`${loadingWidth}%`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Metaloader;
