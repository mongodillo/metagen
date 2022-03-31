import React from "react";

const Metatab = ({ openTab, setOpenTab }) => {
  return (
    <>
      <ul className="flex -mb-px list-none flex-wrap pt-3  flex-row" role="tablist">
        <li className="  last:mr-0 flex-auto text-center ">
          <a
            className={
              "text-xs font-bold uppercase px-5 py-3  rounded-t block leading-normal border-accent border-t border-r border-l  " +
              (openTab === 1
                ? "text-accent-content bg-accent focus:ring-0 focus:outline-none"
                : "text-base-content bg-base-100 focus:ring-0 focus:outline-none")
            }
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(1);
            }}
            data-toggle="tab"
            href="#traitsform"
            role="tablist"
            aria-controls="tab-1-pane"
          >
            1. Traits Input
          </a>
        </li>
        <li className=" last:mr-0 flex-auto text-center">
          <a
            className={
              "text-xs font-bold uppercase px-5 py-3  rounded-t block leading-normal border-accent border-t border-r border-l  " +
              (openTab === 2
                ? "text-accent-content bg-accent focus:ring-0 focus:outline-none"
                : "text-base-content bg-base-100 focus:ring-0 focus:outline-none")
            }
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(2);
            }}
            data-toggle="tab"
            href="#metagen"
            role="tablist"
            aria-controls="tab-2-pane"
          >
            2. Random Generator
          </a>
        </li>
        <li className=" last:mr-0 flex-auto text-center">
          <a
            className={
              "text-xs font-bold uppercase px-5 py-3  rounded-t block leading-normal border-accent border-t border-r border-l  " +
              (openTab === 3
                ? "text-accent-content bg-accent focus:ring-0 focus:outline-none"
                : "text-base-content bg-base-100 focus:ring-0 focus:outline-none")
            }
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(3);
            }}
            data-toggle="tab"
            href="#imagegen"
            role="tablist"
            aria-controls="tab-3-pane"
          >
            3. Image Ouput
          </a>
        </li>
        {/* <li className=" last:mr-0 flex-auto text-center">
          <a
            className={
              "text-xs font-bold uppercase px-5 py-3  rounded-t block leading-normal border-accent border-t border-r border-l  " +
              (openTab === 4
                ? "text-accent-content bg-accent focus:ring-0 focus:outline-none"
                : "text-base-content bg-base-100 focus:ring-0 focus:outline-none")
            }
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(4);
            }}
            data-toggle="tab"
            href="#ipfs"
            role="tablist"
            aria-controls="tab-4-pane"
          >
            4. IPFS Upload
          </a>
          </li>*/}
      </ul>
    </>
  );
};

export default Metatab;
