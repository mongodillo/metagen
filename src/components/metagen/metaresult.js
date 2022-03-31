import React, { useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";

import PaginatedItems from "./metaresultpaginate";
import Nftmodal from "./metanftmodal";

const Metaresult = ({ meta, weights, setMeta }) => {
  const [toggleCard, setToggleCard] = useState(false);
  const [traitFilter, setTraitFilter] = useState([]);
  const [filter, setFilter] = useState({});
  const [openNftcard, setOpenNftcard] = useState(false);
  const [nftSelect, setNftSelect] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState({});

  const handleNftcard = (nft) => {
    setNftSelect(nft);
    setOpenNftcard(true);
  };

  const handleTraitFilterDropdown = (e) => {
    const { name, value } = e.target;
    let filteroption = filter;
    if (!filteroption[name]) filteroption[name] = "";
    if (value === "") delete filteroption[name];
    else {
      filteroption[name] = value;
    }
    setFilter(filteroption);
    let results = meta.filter((nft) =>
      Object.entries(filteroption).every(([key, value]) =>
        nft.attributes.some((attr) => Object.values(attr).includes(key) && Object.values(attr).includes(value))
      )
    );
    setTraitFilter(results);
  };

  const getDropdownOptions = (metadata) => {
    function groupBy(objectArray, property) {
      return objectArray.reduce(function (acc, obj) {
        let key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj.value);
        return acc;
      }, {});
    }
    let dropdownitems = {};

    metadata.forEach((nft) => {
      let nfttraits = groupBy(nft.attributes, "trait_type");
      Object.keys(nfttraits).forEach((traittype) => {
        if (!dropdownitems[traittype]) dropdownitems[traittype] = [];
        if (!dropdownitems[traittype].includes(nfttraits[traittype][0]))
          dropdownitems[traittype] = [...dropdownitems[traittype], nfttraits[traittype][0]];
      });
    });
    setDropdownOptions(dropdownitems);
  };

  const dropdownMenu = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold">Filter:</h1>
        {Object.keys(dropdownOptions).map((trait, index) => (
          <div key={`filter/${trait}/${index}`}>
            <label className="justify-between w-80">
              <span className="inline-block w-32 mt-1">{trait}:</span>
              <select
                name={trait}
                id={`filter${trait}`}
                value={traitFilter[trait]}
                className=" w-44 ml-5 mt-1 select select-sm select-secondary "
                onChange={handleTraitFilterDropdown}
              >
                <option value=""> </option>
                {dropdownOptions[trait].map((traitoption) => (
                  <option value={traitoption} key={`filter/${trait}/${traitoption}`}>
                    {traitoption}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    );
  };

  const NftCard = ({ nftArray }) => {
    return (
      <>
        {nftArray &&
          nftArray.map((nft, i) => (
            <div key={`${nft.name}/card/${i}`} className="my-1 px-1 w-full  lg:my-4 lg:px-4 lg:w-1/2 ">
              <article className="overflow-hidden  rounded-2xl shadow-lg border-2 border-accent grid grid-rows-3 grid-cols-4 grid-flow-col ">
                <div className="row-span-3 col-span-2 ">
                  <img src={nft.image} alt="NFT Gen" className="w-full" />
                </div>
                <div className={`row-span-3 col-span-2 `}>
                  <div className="flex flex-row items-center  mt-2">
                    <h1 className="text-sm lg:text-base font-bold underline ml-2">{nft.name}</h1>
                    <MdOutlineEdit
                      className="mx-2  btn btn-ghost btn-circle btn-xs"
                      onClick={() => {
                        handleNftcard(nft);
                      }}
                    />
                  </div>
                  {Array.from(nft.attributes).map((attr) => (
                    <div
                      key={`${nft.name}/${attr.trait_type}`}
                      className="ml-2 text-xs md:text-sm xl:text-base"
                    >{`${attr.trait_type}: ${attr.value}`}</div>
                  ))}
                </div>
              </article>
            </div>
          ))}
      </>
    );
  };

  const NftGrid = ({ nftArray }) => {
    return (
      <>
        {nftArray &&
          nftArray.map((nft, i) => (
            <img
              key={`${nft.name}/grid/${i}`}
              src={nft.image}
              alt="NFT Gen"
              className="px-1  my-1 md:w-36  w-32  hover:cursor-pointer hover:scale-150"
              onClick={() => {
                handleNftcard(nft);
              }}
            />
          ))}
      </>
    );
  };

  const toggleGridCard = () => {
    return (
      <div className="flex flex-row items-center mb-4">
        <input className="toggle toggle-secondary border-secondary border" type="checkbox" role="switch" onClick={() => setToggleCard(!toggleCard)} />
        <p className="ml-5 font-semibold"> {toggleCard ? "Show Image Grid Only" : "Show Images with Traits"}</p>
      </div>
    );
  };

  useEffect(() => {
    let results = meta.filter((nft) =>
      Object.entries(filter).every(([key, value]) =>
        nft.attributes.some((attr) => Object.values(attr).includes(key) && Object.values(attr).includes(value))
      )
    );
    setTraitFilter(results);
    getDropdownOptions(meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  return (
    <div className="container my-12 mx-auto px-4 mt-4">
      {dropdownMenu()}
      <h1 className="text-2xl font-bold mt-3 mb-3">Results: {Intl.NumberFormat().format(parseInt(traitFilter.length))}</h1>
      {toggleGridCard()}
      <PaginatedItems itemsPerPage={100} nftArray={traitFilter} NftCard={NftCard} NftGrid={NftGrid} toggleCard={toggleCard} />
      <Nftmodal nft={nftSelect} openNftcard={openNftcard} setOpenNftcard={setOpenNftcard} meta={meta} setMeta={setMeta} weights={weights} />
    </div>
  );
};

export default Metaresult;
