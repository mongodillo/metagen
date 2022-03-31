import React, { useState, useEffect } from "react";
import { create as httpCreate, CID } from "ipfs-http-client";
import { useIPFS } from "../../hooks/ipfs";

let ipfsInfura = null;
//let ipfsPinata = null;

const MetaIPFS = ({ metadata, setToastList, toastList, setSpinLoad, toastProcessList, setToastProcessList }) => {
  const ipfs = useIPFS();
  const [imgFiles, setImgFiles] = useState(null);
  const [urlArr, setUrlArr] = useState([]);
  const [finalImg, setFinalImg] = useState({ imgsrc: "", length: "" });

  const address = "dropletImgs";
  var files = [];
  let finalCID;

  async function startInfura() {
    if (ipfsInfura) {
      console.log("IPFS Infura already started");
    } else {
      try {
        console.time("IPFS Infura Started");
        ipfsInfura = await httpCreate("https://ipfs.infura.io:5001/api/v0");
        console.timeEnd("IPFS Infura Started");
      } catch (error) {
        console.error("IPFS Infura init error:", error);
        ipfsInfura = null;
      }
    }
  }

  async function deleteDropletDB(dbName) {
    if (indexedDB) {
      const dbFind = await indexedDB.databases();

      let dbArray = dbFind.filter((db) => db.name.includes(dbName));

      dbArray.forEach((db) => {
        var DBDeleteRequest = indexedDB.deleteDatabase(db.name);

        DBDeleteRequest.onerror = function (event) {
          console.log(db, "Error deleting database.", event);
        };
        DBDeleteRequest.onsuccess = function (event) {
          if (DBDeleteRequest.result === undefined) console.log(db, "Database deleted successfully");
        };
      });
    }
  }
  async function stopIPFS() {
    if (ipfsInfura) ipfsInfura = null;
    /* if (ipfsInfura && ipfsInfura.stop) {
      console.log("Stopping IPFS Infura");
      ipfsInfura.stop().catch((err) => console.error(err));
      ipfsInfura = null;
    }*/
    deleteDropletDB("dropletblue");
    console.log("IPFS STOPPED");
  }

  const loadFiles = async (e) => {
    console.time("Load Files");
    const loadImageBlob = (imgURL) => {
      return new Promise((resolve, reject) => {
        fetch(imgURL)
          .then(async (result) => resolve(await result.blob()))
          .catch((err) => {
            reject(`Error generating image blob: ${err}`);
          });
      });
    };
    setSpinLoad(true);
    setToastProcessList((prevState) => [
      ...prevState,
      { type: "alert-info", status: "processing", id: "ipfsLoad", message: `Loading Images for IPFS upload` },
    ]);
    const blobs = await Promise.all(metadata.map(async (nft) => loadImageBlob(nft.image)));

    blobs.forEach(async (blob, i) => {
      let file = {
        path: `${address}/${i + 1}.png`,
        content: blob,
      };
      files.push(file);
    });
    setImgFiles(files);
    setSpinLoad(false);
    setToastProcessList((prevState) => [
      ...toastProcessList.splice(
        toastProcessList.findIndex((e) => e.id === "ipfsLoad"),
        1
      ),
    ]);
    setToastList((prevState) => [
      ...prevState,
      { type: "alert-info", status: "info", message: `Files loaded for IPFS upload: ${Intl.NumberFormat().format(parseInt(files.length))} files` },
    ]);
    e.preventDefault();
    console.timeEnd("Load Files");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setSpinLoad(true);

    try {
      const options = {
        wrapWithDirectory: false,
        //progress: (prog, path) => console.log(`received: ${prog} / ${path} `),
      };
      let count = 0;
      let urls = [];
      // let fileHashes = [];
      console.log(ipfs);
      for await (const file of ipfs.addAll(imgFiles, options)) {
        if (count < imgFiles.length) {
          const url = `https://ipfs.infura.io/ipfs/${file.cid.toString()}`;
          //let hash = { cid: file.cid };
          //fileHashes.push(hash);
          urls.push(url);
        } else {
          finalCID = file.cid.toString();
          console.log(`https://ipfs.infura.io/ipfs/${file.cid.toString()}`);
        }
        count++;
      }

      let ipfsURL = `<a href="https://ipfs.infura.io/ipfs/${finalCID}" target="_blank" className="link break-all">https://ipfs.infura.io/ipfs/${finalCID}</a>`;
      setUrlArr(urls);
      setFinalImg({ imgsrc: urls[urls.length - 1], length: urls.length });
      await startInfura();
      /*for await (const hash of ipfsInfura.pin.addAll(fileHashes)) {
        console.log(hash);
      }*/

      let infuracid = await ipfsInfura.pin.add(CID.parse(finalCID));
      console.log("INFURA:", infuracid);
      //  for await (const file of ipfsInfura.ls({ paths: finalCID })) {
      //  console.log(file);
      //}

      //await pinToIpfsInfura(finalCID);
      // await pinToIpfsPinata(finalCID);

      setToastList([...toastList, { type: "alert-success", status: "success", message: `IPFS Pin Successful: ${ipfsURL}` }]);
    } catch (err) {
      setToastList([...toastList, { type: "alert-error", status: "error", message: `${err.message}` }]);
      console.log(err);
    } finally {
      //stopIPFS();

      try {
        const res = await fetch(`https://ipfs.infura.io/ipfs/${finalCID}`);
        if (res.status === 200) {
          console.log("infura request succeeded");
          stopIPFS();
        } else {
          const res2 = await fetch(`https://gateway.pinata.cloud/ipfs/${finalCID}`);
          if (res2.status === 200) {
            console.log("pinata request succeeded");
            stopIPFS();
          } else {
            const res3 = await fetch(`https://ipfs.io/ipfs/${finalCID}`);
            if (res3.status === 200) {
              console.log("IPFS request succeeded");
              stopIPFS();
            } else console.error("IPFS GATEWAY TIMED OUT");
          }
        }
      } catch (err) {
        console.log(err);
      }

      setSpinLoad(false);
    }

    //console.log(urlArr);
  };

  useEffect(() => {
    return function cleanup() {
      //stopIPFS();
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">IPFS Upload</h2>
      <button className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm" onClick={loadFiles}>
        Load Files for Uploading
      </button>
      <button className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm" onClick={handleUpload}>
        Upload
      </button>
      <div className="display">
        {urlArr.length !== 0 ? (
          <>
            <div className="flex flex-row ">
              <div className="flex flex-col items-center mx-2">
                First Image from IPFS <img src={urlArr[0]} alt="nfts" className="w-32" />
              </div>
              <div className="flex flex-col items-center">
                First Image from Memory <img src={metadata[0].image} alt="nfts" className="w-32" />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex flex-col items-center mx-2">
                Last Image from IPFS ({finalImg.length}) <img src={finalImg.imgsrc} alt="nfts" className="w-32" />
              </div>
              <div className="flex flex-col items-center">
                Last Image from Memory ({metadata.length}) <img src={metadata[metadata.length - 1].image} alt="nfts" className="w-32" />
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default MetaIPFS;
