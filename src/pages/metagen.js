import React, { useState, useEffect } from "react";

import Traitsform from "../components/metagen/metatraitsform";
import Metatraitcount from "../components/metagen/metatraitcount";
import Metaloader from "../components/metagen/metaloader";
import Metaresult from "../components/metagen/metaresult";
import Metatab from "../components/metagen/metatab";
import MetaIPFS from "../components/metagen/metaipfs";

import { metaRandomGen } from "../components/metagen/metarandomgen";

//import WorkerRandGen from "../workers/randomgenworker";

import JSZip from "jszip";

const Metagen = (props) => {
  const { setToastList, toastList, setToastProcessList, toastProcessList, setSpinLoad } = props;
  const [traits, setTrait] = useState([{ trait: "", options: [{ name: "", weight: "", imgsrc: "", filename: "", rarity: "", max: "" }] }]);
  const [weights, setWeight] = useState({});
  const [maxGen, setMaxGen] = useState(0);
  const [seed, setSeed] = useState("");
  const [totalGen, setTotalGen] = useState("");
  const [meta, setMeta] = useState([]);
  const [loadingWidth, setLoadingWidth] = useState(0);
  const [traitCount, setTraitCount] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [openTab, setOpenTab] = useState(1);

  const getWeights = (traitsArray) => {
    /*const loadImageBlob = (imgURL) => {
      return new Promise((resolve, reject) => {
        fetch(imgURL)
          .then((result) => resolve(result.blob()))
          .catch((err) => {
            reject(`Error generating image blob: ${err}`);
          });
      });
    };*/
    let w = {};
    if (traitsArray[0].trait === "") {
      setToastList([...toastList, { type: "alert-error", status: "error", message: `Traits field is empty` }]);
    } else {
      if (traitsArray[0].options[0].name === "" || traitsArray[0].options[0].weight === "" || traitsArray[0].options[0].rarity === "") {
        setToastList([...toastList, { type: "alert-error", status: "error", message: `Traits Option field is empty` }]);
      } else {
        for (let i = 0; i < traitsArray.length; i++) {
          if (traitsArray[i].trait === "") {
            setToastList([...toastList, { type: "alert-error", status: "error", message: `Trait ${i} is empty` }]);
          } else {
            w[traitsArray[i].trait] = [];
            for (let x = 0; x < traitsArray[i].options.length; x++) {
              if (traitsArray[i].options[x].name === "" || traitsArray[i].options[x].weight === "" || traitsArray[i].options[x].rarity === "") {
                setToastList([...toastList, { type: "alert-error", status: "error", message: `Option ${x} is empty` }]);
              } else {
                w[traitsArray[i].trait].push({
                  name: traitsArray[i].options[x].name,
                  rarity: traitsArray[i].options[x].rarity,
                  weight: parseInt(traitsArray[i].options[x].weight),
                  imgsrc: traitsArray[i].options[x].imgsrc,
                  //localurl: "",
                });
              }
            }
          }
        }
        /* Object.keys(w).forEach((trait) => {
          w[trait].forEach(async (option, i) => {
            let blob = await loadImageBlob(option.imgsrc);
            let localURL = URL.createObjectURL(blob);
            if (!w[trait][i]["localurl"]) w[trait][i]["localurl"] = "";
            w[trait][i]["localurl"] = localURL;
          });
        });*/

        /*
        const weightArray = traits.reduce((weightArr, obj) => {
          let key = obj.trait;
          if (!weightArr[key]) weightArr[key] = [];
          weightArr[key] = obj.options;
          return weightArr;
        }, {});

        let issame = weightArray.toString() === w.toString();
        */
        setWeight(w);
        //setOpenTab(2);
        /*
        let totalWeights = {};
        Object.keys(w).forEach((traitType) => {
          if (!totalWeights[traitType]) totalWeights[traitType] = "";

          let traitWeights = [];

          w[traitType].forEach((traitOption) => {
            traitWeights.push(traitOption.weight);
          });
          totalWeights[traitType] = traitWeights.reduce((a, b) => a + b, 0);
        });
        let totalGenOptions = Object.values(totalWeights).reduce((a, b) => a + b, 0);
*/
        let genOptions = [];
        for (let i = 0; i < Object.keys(w).length; i++) {
          genOptions.push(w[Object.keys(w)[i]].length);
        }

        let totalOptions = genOptions.reduce((prevVal, currVal) => {
          return prevVal * currVal;
        });
        setMaxGen(parseInt(totalOptions));
        //setMaxGen(parseInt(totalGenOptions));
        setToastList([...toastList, { type: "alert-success", status: "success", message: `Weights Generated` }]);
      }
    }
  };

  const handleRandomGenInput = (e) => {
    const { name, value } = e.target;
    if (name === "seed") {
      setSeed(value);
    } else if (name === "totalGen") {
      setTotalGen(Math.max(Math.min(value, maxGen), 0));

      /* let w = weights;

      Object.keys(w).forEach((trait) => {
        w[trait].forEach((option, i) => {
          w[trait][i].max = parseInt((value * rarityWeights[option.rarity]) / 1000);
        });
      });
      setWeight(w);*/
    }
  };

  const countTraits = (metadata) => {
    let attrObj = {};
    let attrCount = {};
    // Object.keys(weights).forEach((trait) => (attrObj[trait] = []));

    metadata.forEach((nft) => {
      nft.attributes.forEach((trait) => {
        if (!attrObj[trait.trait_type]) attrObj[trait.trait_type] = [];
        attrObj[trait.trait_type].push(trait.value);
      });
    });
    Object.keys(attrObj).forEach((trait) => {
      let countedTrait = attrObj[trait].reduce((allOptions, option) => {
        if (option in allOptions) {
          allOptions[option]++;
        } else {
          allOptions[option] = 1;
        }
        return allOptions;
      }, {});
      attrCount[trait] = countedTrait;
    });
    setTraitCount(attrCount);
  };

  const runRandomGen = async () => {
    if (maxGen === 0 || Object.keys(weights).length === 0) {
      setToastList([
        ...toastList,
        { type: "alert-error", status: "error", message: `Weights not loaded for meta generation. Please click on "Generate Weights` },
      ]);
    } else if (totalGen === "" || totalGen === 0) {
      setToastList([...toastList, { type: "alert-error", status: "error", message: `No quantity detected` }]);
    } else {
      try {
        setToastProcessList([
          ...toastProcessList,
          {
            type: "alert-info",
            status: "processing",
            id: "randomGen",
            message: `Generating Metadata for ${Intl.NumberFormat().format(parseInt(totalGen))} NFTs...`,
          },
        ]);
        console.log(`Generating Metadata for ${Intl.NumberFormat().format(parseInt(totalGen))} NFTs...`);

        setSpinLoad(true);

        var randommeta;

        /*  const bodydata = {
          weights,
          seed,
          totalGen,
        };
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify(bodydata),
        };

         try {
          const fetchresponse = await fetch(" https://dropletworker.mongodillo.workers.dev/randomgen", options);
          const responseJSON = await fetchresponse.json();
          console.log("Fetch: Combined MD5 hash of all generated NFTs:", responseJSON.data.hash);
          randommeta = responseJSON.data.metadata;
        } catch (err) {
          console.log("Fetch Error:", err);
          randommeta = await metaRandomGen(weights, seed, totalGen);
        }*/
        randommeta = await metaRandomGen(weights, seed, totalGen);
        setMeta(randommeta);
        setToastProcessList([
          ...toastProcessList.splice(
            toastProcessList.findIndex((e) => e.id === "randomGen"),
            1
          ),
        ]);
        setToastList([
          ...toastList,
          { type: "alert-success", status: "success", message: `Metadata Generated for ${Intl.NumberFormat().format(parseInt(totalGen))} NFTs` },
        ]);
        countTraits(randommeta);
      } catch (err) {
        setToastList([...toastList, { type: "alert-error", status: "error", message: `${err.message}` }]);
      } finally {
        setSpinLoad(false);
      }
    }
  };

  //save Metadata Generated to JSON file
  const saveMetatoFile = (jsonData, filename) => {
    var downloadJSON = jsonData.map(({ image, ...rest }) => rest); //strips out image field

    const fileData = JSON.stringify(downloadJSON, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadMetafromFile = (e) => {
    const fileReader = new FileReader();
    const { files } = e.target;
    if (files.length > 0) {
      fileReader.readAsText(files[0], "UTF-8");
      let filename = files[0].name;
      fileReader.onload = (e) => {
        try {
          const JSONdata = JSON.parse(e.target.result);
          if (JSONdata[0].name === undefined || JSONdata[0].attributes === null) {
            setToastList([...toastList, { type: "alert-error", status: "error", message: `${filename} does not contain correct key values` }]);
          } else {
            setMeta(JSONdata);
            setTotalGen(JSONdata.length);
            countTraits(JSONdata);
            setToastList([...toastList, { type: "alert-success", status: "success", message: `${filename} uploaded` }]);
          }
        } catch (err) {
          setToastList([...toastList, { type: "alert-error", status: "error", message: `${err.message}` }]);
        }
      };
    }
    e.target.value = null;
  };

  const genImage = async () => {
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

    setIsLoading(true);
    setLoadingWidth(0);

    let w = weights;
    let timenow = new Date().getTime();
    let count = 0;
    let progressInterval = setInterval(() => {
      setLoadingWidth((Number(count / totalGen) * 100).toFixed(0));
    }, 10);

    if (Object.keys(w).length === 0) setToastList([...toastList, { type: "alert-error", status: "error", message: `Weights not loaded` }]);
    else if (meta.length === 0) setToastList([...toastList, { type: "alert-error", status: "error", message: `Metadata not loaded` }]);
    else if (Object.keys(w).length < meta[0].attributes.length)
      setToastList([...toastList, { type: "alert-error", status: "error", message: `Trait Options  do not match Metadata` }]);
    //attr => meta[i].attributes
    else {
      let statuslog = [];

      const canvasparent = document.getElementById("canvaslist");
      const canvas = document.createElement("canvas");
      canvas.setAttribute("width", "400");
      canvas.setAttribute("height", "400");
      canvas.setAttribute("className", "hidden");
      canvasparent.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      let newmeta = [...meta];
      const traitArr = {};
      Object.keys(w).forEach((trait) => {
        traitArr[trait] = [];
        w[trait].forEach(async (option, i) => {
          traitArr[trait].push(option.name);
        });
      });

      for (let i = 0; i < meta.length; i++) {
        count++;
        ctx.clearRect(0, 0, 400, 400);
        //canvas.setAttribute("id", `canvas${i}`);

        const images = [];

        try {
          meta[i].attributes.forEach((trait) => {
            if (w[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)]) {
              if (trait.value !== "None") {
                if (
                  // w[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)].localurl !== "" ||
                  w[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)].imgsrc !== ""
                ) {
                  // w[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)].localurl
                  // ? images.push(w[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)].localurl)
                  //:
                  images.push(w[trait.trait_type][traitArr[trait.trait_type].indexOf(trait.value)].imgsrc);
                } else {
                  statuslog.push(`Missing Image File:  NFT #${i} - Trait: "${trait.trait_type}" Option: "${trait.value}" `);
                }
              } else {
              }
            } else {
              statuslog.push(`Missing Trait Option:  NFT #${i} - Trait: "${trait.trait_type}" Option: "${trait.value}" `);
            }
          });

          if (images.length > 0) {
            let layers = await Promise.all(images.map(async (image) => loadImage(image)));
            layers.forEach((layer) => {
              ctx.drawImage(layer, 0, 0, 400, 400);
            });

            /* if (!newmeta[i].localurl) newmeta[i].localurl = "";
            canvas.toBlob((blob) => {
              const localurl = URL.createObjectURL(blob);

              newmeta[i].localurl = localurl;
            });*/
            const base64Data = canvas.toDataURL();
            newmeta[i].image = base64Data;
          } else {
            newmeta[i].image = "";
            //newmeta[i].localurl = "";
          }
        } catch (err) {
          setToastList([...toastList, { type: "alert-error", status: "error", message: `Canvas Drawing: ${err.message}` }]);
        } finally {
        }
        //console.log(`Image ${i + 1} done`);
        if (i === meta.length - 1) clearInterval(progressInterval);
      }
      canvas.remove();
      setMeta(newmeta);

      /* Object.keys(w).forEach((trait) => {
        w[trait].forEach(async (option, i) => {
          URL.revokeObjectURL(option.localurl);
          w[trait][i]["localurl"] = "";
        });
      });*/

      let timecomplete = new Date().getTime();
      let timeelapse = timecomplete - timenow;
      var days = Math.floor(timeelapse / (1000 * 60 * 60 * 24));
      var hours = Math.floor((timeelapse % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((timeelapse % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeelapse % (1000 * 60)) / 1000);
      let addToast = [];
      if (statuslog.length > 0)
        //addToast.push({ type: "alert-error", status: "error", message: `${statuslog ? `<div>${statuslog}</div>` : ""}` });
        addToast.push({
          type: "alert-error",
          status: "error",
          message: `${statuslog ? statuslog.map((status, i) => `<div key='statuslog${i}'><p>${status}</p></div>`) : ""}`,
        });
      addToast.push({
        type: "alert-success",
        status: "success",
        message: `Total time taken to generate images for ${Intl.NumberFormat().format(
          parseInt(totalGen)
        )} NFTs: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`,
      });

      setToastList([...toastList, ...addToast]);
    }
    setIsLoading(false);
  };

  const downloadGeneratedFiles = async () => {
    setSpinLoad(true);
    setToastProcessList([
      ...toastProcessList,
      { type: "alert-info", status: "processing", id: "downloadGenFiles", message: `Saving Images, metadata, and weights to file...${Date.now()}` },
    ]);

    const loadImageBlob = (imgURL) => {
      if (imgURL) {
        return new Promise((resolve, reject) => {
          fetch(imgURL)
            .then((result) => resolve(result.blob()))
            .catch((err) => {
              reject(`Error generating image blob: ${err}`);
            });
        });
      }
    };

    var zip = new JSZip();
    let imgfolder = zip.folder(`NFT_Generated_Images_${Date.now()}`);
    let link;
    let zipURL;
    try {
      let imgblobs = await Promise.all(meta.map(async (nft) => loadImageBlob(nft.image)));
      imgblobs.forEach((imgblob, i) => {
        if (imgblob?.type?.includes("image")) {
          imgfolder.file(`${i + 1}.png`, imgblob);
        }
      });

      const metadata = meta.map(({ image, ...rest }) => rest); //strips out image field
      const fileData = JSON.stringify(metadata, null, 2);
      const blobMeta = new Blob([fileData], { type: "application/json" });
      zip.file(`metadata.json`, blobMeta);

      const weightsData = JSON.stringify(weights, null, 2);
      const blobWeights = new Blob([weightsData], { type: "application/json" });
      zip.file(`weights.json`, blobWeights);

      zip
        .generateAsync({ type: "blob" })
        .then(function (blob) {
          zipURL = URL.createObjectURL(blob);
          link = document.createElement("a");
          link.download = `NFT_Generated_Images_${Date.now()}.zip`;
          link.href = zipURL;
        })
        .then(() => {
          link.click();
          setSpinLoad(false);
          setToastProcessList([
            ...toastProcessList.splice(
              toastProcessList.findIndex((e) => e.id === "downloadGenFiles"),
              1
            ),
          ]);
          setToastList([...toastList, { type: "alert-success", status: "success", message: `File ready for download` }]);
        })
        .then(() => URL.revokeObjectURL(zipURL));
    } catch (err) {
      setToastProcessList([
        ...toastProcessList.splice(
          toastProcessList.findIndex((e) => e.id === "downloadGenFiles"),
          1
        ),
      ]);
      setToastList([...toastList, { type: "alert-error", status: "error", message: `${err.message}` }]);
    }
  };

  useEffect(() => {
    if (openTab === 2) getWeights(traits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTab]);

  return (
    <div className="container my-20 mx-auto">
      <Metaloader isLoading={isLoading} loadingWidth={loadingWidth} />

      <h1 className="font-bold text-lg sm:text-2xl lg:text-4xl xl:text-5xl mb-5">Random Metadata and Image Generator</h1>

      <Metatab openTab={openTab} setOpenTab={setOpenTab} />
      <div className="px-5 pt-5 border rounded-b border-accent border-t-8 ">
        <div className={openTab === 1 ? "block" : "hidden"} id="traitsform">
          <Traitsform getWeights={getWeights} setToastList={setToastList} toastList={toastList} traits={traits} setTrait={setTrait} />
        </div>
        <div className={openTab === 2 ? "block" : "hidden"} id="metagen">
          <h2 className="text-2xl font-bold">Meta Generator </h2>

          <div className="border border-accent mt-5 px-2">
            <p className=" font-bold">Summary of Traits [Option, Rarity]</p>
            <div className="my-5 w-full flex flex-col lg:flex-row lg:flex-wrap place-content-between text-sm">
              {Object.keys(weights).length > 0
                ? Object.keys(weights).map((traitType, i) => (
                    <div key={`${traitType}/${i}`}>
                      <p className="underline font-bold mt-1">{traitType}</p>
                      {weights[traitType].map((option, index) => (
                        <p key={`${traitType}/${option.name}/${index}`} className="whitespace-nowrap	">
                          {option.name}, {option.rarity}
                        </p>
                      ))}
                    </div>
                  ))
                : ""}
            </div>
          </div>
          <div className="my-5 font-bold">Max Permutations: {Intl.NumberFormat().format(parseInt(maxGen))}</div>
          <div className="flex flex-row w-full max-w-sm ">
            <label className="label w-44">
              <span className="label-text">Seed Phrase (Optional): </span>
            </label>
            <input
              type="text"
              className=" input input-secondary  w-32 max-w-xs "
              name="seed"
              value={seed}
              placeholder="Enter Seed"
              onChange={(e) => handleRandomGenInput(e)}
            />
          </div>
          <div className="flex flex-row w-full max-w-sm mt-4">
            <label className="label  w-44">
              <span className="label-text ">No. of NFTs to Generate: </span>
            </label>
            <input
              type="number"
              className=" input input-secondary  w-32 max-w-xs "
              name="totalGen"
              value={totalGen}
              placeholder="# NFTs"
              onChange={(e) => handleRandomGenInput(e)}
            />
          </div>

          <div id="buttons" className="flex lg:flex-row flex-col  justify-between lg:mx-0 mx-auto mt-2">
            <div className="flex lg:flex-row flex-col items-center">
              <button className="my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm" onClick={() => runRandomGen()}>
                Generate Metadata
              </button>
            </div>
            <div className="flex lg:flex-row flex-col items-center ">
              <button
                className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm"
                onClick={() => saveMetatoFile(meta, "Metadata")}
              >
                Download Metadata
              </button>
              <label htmlFor="metaupload" className="my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm">
                Load Metadata
              </label>
              <input
                className="hidden"
                id="metaupload"
                type="file"
                name="jsontraits"
                accept=".json,.txt,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={loadMetafromFile}
              />
            </div>
          </div>

          <Metatraitcount meta={meta} traitCount={traitCount} countTraits={countTraits} />
        </div>
        <div className={openTab === 3 ? "block" : "hidden"} id="imagegen">
          <h2 className="text-2xl font-bold mb-5">
            Metadata and Image Results: <span className="">{Intl.NumberFormat().format(parseInt(meta.length))}</span> generated
          </h2>

          <div id="buttons" className="flex lg:flex-row flex-col  justify-between mx-auto">
            <div className="flex lg:flex-row flex-col items-center">
              <button className="my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm" onClick={() => genImage()}>
                Generate Images
              </button>
              <button
                className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm"
                onClick={() => downloadGeneratedFiles()}
              >
                Download Generated Files
              </button>
            </div>
            <div className="flex lg:flex-row flex-col items-center ">
              <button
                className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm"
                onClick={() => saveMetatoFile(meta, "Metadata")}
              >
                Download Metadata
              </button>
              <label htmlFor="metauploadimginput" className="my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm">
                Load Metadata
              </label>
              <input
                className="hidden"
                id="metauploadimginput"
                type="file"
                name="jsontraits"
                accept=".json,.txt,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={loadMetafromFile}
              />
            </div>
          </div>
          <div>
            <Metaresult meta={meta} weights={weights} setMeta={setMeta} />
            <div id="canvaslist"></div>
          </div>
        </div>
        <div className={openTab === 4 ? "block" : "hidden"} id="ipfs">
          <MetaIPFS
            metadata={meta}
            setToastList={setToastList}
            toastList={toastList}
            setSpinLoad={setSpinLoad}
            setToastProcessList={setToastProcessList}
            toastProcessList={toastProcessList}
          />
        </div>
      </div>
    </div>
  );
};

export default Metagen;
