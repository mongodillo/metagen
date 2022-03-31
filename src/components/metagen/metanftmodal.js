import React, { useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";

let nftno;
const Nftmodal = ({ nft, openNftcard, setOpenNftcard, meta, setMeta, weights }) => {
  const [inputOpen, setInputOpen] = useState(Array(10).fill(false));
  const [editOpen, setEditOpen] = useState(false);
  const [traitEdit, setTraitEdit] = useState([]);
  const [traitOptions, setTraitOptions] = useState([]);
  const [imgURL, setImgURL] = useState("");
  const [prevAttr, setPrevAttr] = useState({});

  const handleTraitEdit = (attr, i) => {
    nftno = meta.findIndex((metanft) => metanft.name === nft.name) + 1;
    setTraitEdit(meta[nftno - 1].attributes);
    let prevVal = {};
    if (!prevVal[attr.trait_type]) prevVal[attr.trait_type] = "";
    prevVal[attr.trait_type] = attr.value;
    setPrevAttr(prevVal);

    let inputopenarr = [...inputOpen];
    inputopenarr[i] = true;
    setInputOpen(inputopenarr);

    setImgURL(nft.imagedata);

    let filteroption = {};
    nft.attributes.forEach((attribute) => {
      filteroption[attribute.trait_type] = attribute.value;
    });
    let possibleOptions = [];
    possibleOptions.push(attr.value);
    weights[attr.trait_type].forEach((option) => {
      filteroption[attr.trait_type] = option.name;
      let result = meta.filter((nft) =>
        Object.entries(filteroption).every(([key, value]) =>
          nft.attributes.some((attr) => Object.values(attr).includes(key) && Object.values(attr).includes(value))
        )
      );
      if (result.length === 0) possibleOptions.push(option.name);
    });

    setTraitOptions(possibleOptions);
  };

  const handleDropDownFilter = (e, i) => {
    const { value } = e.target;
    let newtrait = [...traitEdit];
    newtrait[i].value = value;
    setTraitEdit(newtrait);
    genSingleImage(newtrait);
  };

  const handleTraitSave = (attr, i) => {
    let currTrait = [...traitEdit];
    let newnft = nft;
    newnft.imagedata = imgURL;
    newnft.attributes = currTrait;
    let metaupdate = [...meta];
    metaupdate[nftno - 1] = newnft;
    setMeta(metaupdate);
    setEditOpen(false);
    setInputOpen(Array(10).fill(false));
  };

  const handleCancel = (attr, i) => {
    setEditOpen(false);
    setInputOpen(Array(10).fill(false));
    let prevTrait = [...traitEdit];
    prevTrait[i].value = prevAttr[attr.trait_type];
    setTraitEdit(prevTrait);
  };

  const closeModal = () => {
    if (!editOpen) {
      setOpenNftcard(false);
      setEditOpen(false);
      setInputOpen(Array(10).fill(false));
    }
  };

  const genSingleImage = async (nfttraits) => {
    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        let imageObj = new Image();

        imageObj.onload = () => {
          if (imageObj.width === 0 || imageObj.height === 0) reject("Image did not load");
          else resolve(imageObj);
        };
        imageObj.onerror = (err) => reject(`Failed to load Image: ${err}`);
        imageObj.src = url;
      });
    };

    const canvasparent = document.getElementById("canvaslist");
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", `canvas${nftno}`);
    canvas.setAttribute("width", "400");
    canvas.setAttribute("height", "400");
    canvas.setAttribute("className", "hidden");
    canvasparent.appendChild(canvas);
    //const canvas = document.getElementById(`canvas${i}`);
    const ctx = canvas.getContext("2d");
    const traitArr = {};
    const images = [];

    Object.keys(weights).forEach((trait) => {
      traitArr[trait] = [];
      weights[trait].forEach((option) => {
        traitArr[trait].push(option.name);
      });
    });

    nfttraits.forEach((trait) => {
      if (weights[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)]) {
        if (trait.value !== "None") {
          if (weights[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)].imgsrc !== "") {
            images.push(weights[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)].imgsrc);
          } else {
            console.error(`ERROR: Missing Image for Image Generation:  NFT #${nftno} - Trait: ${trait.trait_type} | Option: ${trait.value} `);
          }
        } else {
        }
      } else {
        console.error(`ERROR: Missing Trait Option for Image Generation:  NFT #${nftno} - Trait: ${trait.trait_type} | Option: ${trait.value} `);
      }
    });

    try {
      let layers = await Promise.all(images.map(async (image) => loadImage(image)));
      layers.forEach((layer) => {
        ctx.drawImage(layer, 0, 0, 400, 400);
      });
      if (images.length > 0) {
        setImgURL(canvas.toDataURL());
      } else {
        setImgURL("");
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      canvas.remove();
    }
  };

  const nftResults = (nftSelect) => {
    if (!nftSelect["name"] || !nftSelect["attributes"]) {
      return <div></div>;
    } else
      return (
        <>
          <div className={`modal ${openNftcard ? "modal-open" : ""}`}>
            <div className="modal-box ">
              <article className="overflow-hidden  rounded-2xl shadow-lg border-2 border-accent grid grid-rows-3 grid-cols-4 grid-flow-col ">
                <div className="row-span-3 col-span-2 ">
                  <img src={editOpen ? imgURL : nftSelect.imagedata} alt="NFT Gen" className="w-full" />
                </div>
                <div className={`row-span-3 col-span-2 text-left `}>
                  <h1 className="text-sm lg:text-base font-bold underline ml-2">{nftSelect.name}</h1>
                  {Array.from(nftSelect.attributes).map((attr, i) => (
                    <div key={`${nftSelect.name}/${attr.trait_type}`} className="mx-2 text-xs md:text-sm xl:text-base">
                      <div className={`inline-flex ${inputOpen[i] ? "flex-col" : "flex-row"} w-full `}>
                        <span>
                          {`${attr.trait_type}: `}
                          <span id={`${attr.trait_type}value`} className={`${inputOpen[i] ? "hidden" : ""} mr-2`}>{`${attr.value}`}</span>
                          <select
                            id={`${attr.trait_type}dropdown`}
                            name={`${attr.trait_type}`}
                            value={traitEdit[i].value}
                            className={`${inputOpen[i] ? "select  select-xs md:select-sm select-secondary w-full" : "hidden"}`}
                            onChange={(e) => handleDropDownFilter(e, i)}
                          >
                            {traitOptions.map((option, i) => (
                              <option value={option} key={`filter/${attr.trait_type}/${option}`}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </span>
                        <MdOutlineEdit
                          className={`${editOpen ? "hidden" : "btn btn-ghost btn-circle btn-xs"}`}
                          onClick={() => handleTraitEdit(attr, i)}
                        />
                        <div className="flex flex-row my-1 justify-center ">
                          <button
                            className={`${inputOpen[i] ? "" : "hidden"}  btn btn-xs md:btn-sm btn-primary normal-case mr-1 w-16 rounded-full`}
                            onClick={() => {
                              handleTraitSave(attr, i);
                            }}
                          >
                            Save
                          </button>
                          <button
                            className={`${inputOpen[i] ? "" : "hidden"} btn btn-xs md:btn-sm btn-primary normal-case w-16 rounded-full`}
                            onClick={() => {
                              handleCancel(attr, i);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <div className="modal-action">
                <p className={editOpen ? "text-sm italic" : "hidden"}>Please save or cancel trait edit before closing</p>
                <button
                  className="btn btn-primary btn-xs md:btn-sm normal-case rounded-full"
                  onClick={() => {
                    closeModal();
                  }}
                  disabled={editOpen ? true : ""}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      );
  };

  useEffect(() => {
    if (meta.length > 0) {
      setTraitEdit(meta[0].attributes);
    }
  }, [meta]);

  useEffect(() => {
    if (inputOpen.some((input) => input === true)) setEditOpen(true);
    else setEditOpen(false);
  }, [inputOpen]);

  return nftResults(nft);
};

export default Nftmodal;
