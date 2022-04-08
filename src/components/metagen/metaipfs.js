import React, { useState, useEffect } from "react";
import { copyTextOnClick } from "../../utils/copyTextOnClick";
import { useIPFS } from "../../hooks/ipfs";

const MetaIPFS = ({ metadata, setMeta, setToastList, setSpinLoad, setToastProcessList }) => {
  const ipfs = useIPFS();
  const [ipfsImg, setIpfsImg] = useState({
    infura: "https://ipfs.infura.io/ipfs/",
    cf: "https://cloudflare-ipfs.com/ipfs/",
    dweb: "https://dweb.link/ipfs/",
    ipfs: "https://ipfs.io/ipfs/",
    pinata: "https://gateway.pinata.cloud/ipfs/",
    length: 0,
    localfirst: "",
    locallast: "",
  });

  const address = "dropletImgs";
  var files = [];
  let finalCID;

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
    /* if (ipfsInfura && ipfsInfura.stop) {
      console.log("Stopping IPFS Infura");
      ipfsInfura.stop().catch((err) => console.error(err));
      ipfsInfura = null;
    }*/
    deleteDropletDB("metagen");
    console.log("IPFS STOPPED");
  }

  const loadFiles = async () => {
    URL.revokeObjectURL(ipfsImg.localfirst);
    URL.revokeObjectURL(ipfsImg.locallast);
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

  
    const blobs = await Promise.allSettled(metadata.map(async (nft) => loadImageBlob(nft.imagedata)));
  
    blobs.forEach(async (blob, i) => {
      let file = {
        path: `${address}/${i + 1}.png`,
        content: blob.value,
      };
      files.push(file);
    });
    // setImgFiles(files);

    //  e.preventDefault();
    console.timeEnd("Load Files");

    return files;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setSpinLoad(true);
    setToastProcessList((prevState) => [
      ...prevState,
      {
        type: "alert-info",
        status: "processing",
        id: "ipfsLoad",
        message: `Uploading images to IPFS`,
        time: new Date(Date.now()).toLocaleTimeString(),
      },
    ]);

    let filelist;
    try {
      filelist = await loadFiles();
      const options = {
        wrapWithDirectory: false,
        //progress: (prog, path) => console.log(`received: ${prog} / ${path} `),
      };
      let count = 0;
      let urls = [];
      // let fileHashes = [];

      for await (const file of ipfs.addAll(filelist, options)) {
        if (count < filelist.length) {
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

      //setUrlArr(urls);
      setIpfsImg((prevState) => ({ ...prevState, length: urls.length, cid: finalCID }));

      for await (const buf of ipfs.cat(`/ipfs/${finalCID}/${filelist.length}.png`)) {
        // do something with buf

        const blob = new Blob([buf], { type: "image/png" });

        const objectURL = URL.createObjectURL(blob);
        setIpfsImg((prevState) => ({ ...prevState, locallast: objectURL }));
      }

      for await (const buf of ipfs.cat(`/ipfs/${finalCID}/1.png`)) {
        // do something with buf

        const blob = new Blob([buf], { type: "image/png" });

        const objectURL = URL.createObjectURL(blob);
        setIpfsImg((prevState) => ({ ...prevState, localfirst: objectURL }));
      }

      //await startInfura();
      //let infuracid = await ipfsInfura.pin.add(CID.parse(finalCID));
      //console.log("INFURA:", infuracid);

      try {
        const res = await fetch(`${ipfsImg.infura}${finalCID}/${filelist.length}.png`);
        if (res.status === 200) {
          let ipfsURL = `<a href="${ipfsImg.infura}${finalCID}" target="_blank" className="link break-all">${ipfsImg.infura}${finalCID}</a>`;
          console.log("infura request succeeded");
          setToastList((prevState) => [
            ...prevState,
            { type: "alert-success", status: "success", message: `IPFS Pin Successful: ${ipfsURL}`, time: new Date(Date.now()).toLocaleTimeString() },
          ]);
          stopIPFS();
        } else {
          const res2 = await fetch(`${ipfsImg.cf}${finalCID}/${filelist.length}.png`);
          if (res2.status === 200) {
            let ipfsURL = `<a href="${ipfsImg.cf}${finalCID}" target="_blank" className="link break-all">${ipfsImg.cf}${finalCID}</a>`;
            console.log("cloudflare request succeeded");
            setToastList((prevState) => [
              ...prevState,
              {
                type: "alert-success",
                status: "success",
                message: `IPFS Pin Successful: ${ipfsURL}`,
                time: new Date(Date.now()).toLocaleTimeString(),
              },
            ]);
            stopIPFS();
          } else {
            const res3 = await fetch(`${ipfsImg.dweb}${finalCID}/${filelist.length}.png`);
            if (res3.status === 200) {
              let ipfsURL = `<a href="${ipfsImg.dweb}${finalCID}" target="_blank" className="link break-all">${ipfsImg.dweb}${finalCID}</a>`;
              console.log("dweb link request succeeded");
              setToastList((prevState) => [
                ...prevState,
                {
                  type: "alert-success",
                  status: "success",
                  message: `IPFS Pin Successful: ${ipfsURL}`,
                  time: new Date(Date.now()).toLocaleTimeString(),
                },
              ]);
              stopIPFS();
            } else {
              const res4 = await fetch(`${ipfsImg.pinata}${finalCID}/${filelist.length}.png`);
              if (res4.status === 200) {
                let ipfsURL = `<a href="${ipfsImg.pinata}${finalCID}" target="_blank" className="link break-all">${ipfsImg.pinata}${finalCID}</a>`;
                console.log("pinata request succeeded");
                setToastList((prevState) => [
                  ...prevState,
                  {
                    type: "alert-success",
                    status: "success",
                    message: `IPFS Pin Successful: ${ipfsURL}`,
                    time: new Date(Date.now()).toLocaleTimeString(),
                  },
                ]);
                stopIPFS();
              } else {
                console.error("IPFS GATEWAY TIMED OUT");
                setToastList((prevState) => [
                  ...prevState,
                  { type: "alert-error", status: "error", message: `IPFS Gateway Timed Out`, time: new Date(Date.now()).toLocaleTimeString() },
                ]);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
        setToastList((prevState) => [
          ...prevState,
          { type: "alert-error", status: "error", message: `${err.message}`, time: new Date(Date.now()).toLocaleTimeString() },
        ]);
      }
    } catch (err) {
      setToastList((prevState) => [
        ...prevState,
        { type: "alert-error", status: "error", message: `${err.message}`, time: new Date(Date.now()).toLocaleTimeString() },
      ]);
      console.log(err);
    } finally {
      setToastProcessList((prevState) => [...prevState].filter((e) => e.id !== "ipfsLoad"));
      setSpinLoad(false);
    }

    //console.log(urlArr);
  };

  const handleMetaUpdate = (e) => {
    e.preventDefault();
    const metadataArr = [...metadata];
    const cid = ipfsImg.cid;
    console.time("Update Metadata");
    metadataArr.forEach((nft, index) => (nft.image = `ipfs://${cid}/${index + 1}.png`));

    setMeta(metadataArr);

    console.timeEnd("Update Metadata");
  };

  useEffect(() => {
    return function cleanup() {
      //stopIPFS();
      if (ipfsImg.localfirst) URL.revokeObjectURL(ipfsImg.localfirst);
      if (ipfsImg.locallast) URL.revokeObjectURL(ipfsImg.locallast);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">IPFS Upload</h2>
      <button className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm" onClick={handleUpload}>
        Upload Images to IPFS
      </button>

      <button className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm" onClick={handleMetaUpdate}>
        Update Metadata for latest IPFS hash/address
      </button>

      <button className="mx-4 my-2 btn btn-primary rounded-full normal-case text-base font-bold btn-sm gap-2 btn-disabled">
        Upload Metadata to IPFS
        <div className="badge badge-error">Coming Soon</div>
      </button>

      <div className="display">
        {ipfsImg.cid && (
          <>
            <div className="flex flex-col md:flex-row my-5 gap-5 items-center">
              Images IPFS Hash:
              <a className="link break-all" href={`${ipfsImg.infura}${ipfsImg.cid}`} target="_blank" rel="noreferrer">
                {ipfsImg.cid}
              </a>
              <button
                className=" btn  btn-primary btn-sm lowercase  text-lg rounded-full tooltip tooltip-right  "
                data-tip="Copy Images IPFS Hash"
                value={ipfsImg.cid}
                onClick={(e) => copyTextOnClick(e)}
              >
                Copy
              </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between my-5 ">
              <div className="block  text-center ">
                <span className="text-center font-semibold underline">First Image</span>

                <div className="flex flex-col md:flex-row justify-between  gap-5 items-center">
                  <div className="flex flex-col items-center w-32 h-32 ">
                    Local IPFS <img src={`${ipfsImg.localfirst}`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center w-32 h-32 ">
                    Pinata <img src={`${ipfsImg.pinata}${ipfsImg.cid}/1.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center w-32 h-32">
                    Infura <img src={`${ipfsImg.infura}${ipfsImg.cid}/1.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-5 my-10 items-center">
                  <div className="flex flex-col items-center  w-32 h-32">
                    IPFS Gateway <img src={`${ipfsImg.ipfs}${ipfsImg.cid}/1.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center w-32 h-32">
                    Cloudflare <img src={`${ipfsImg.cf}${ipfsImg.cid}/1.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center  w-32 h-32">
                    Dweb <img src={`${ipfsImg.dweb}${ipfsImg.cid}/1.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                </div>
              </div>
              <div className="block  text-center ">
                <span className="text-center font-semibold underline">Last Image</span>

                <div className="flex flex-col md:flex-row justify-between  gap-5 items-center">
                  <div className="flex flex-col items-center w-32 h-32 ">
                    Local IPFS <img src={`${ipfsImg.locallast}`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center w-32 h-32 ">
                    Pinata <img src={`${ipfsImg.pinata}${ipfsImg.cid}/${ipfsImg.length}.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center w-32 h-32">
                    Infura <img src={`${ipfsImg.infura}${ipfsImg.cid}/${ipfsImg.length}.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-5 my-10 items-center">
                  <div className="flex flex-col items-center  w-32 h-32">
                    IPFS Gateway <img src={`${ipfsImg.ipfs}${ipfsImg.cid}/${ipfsImg.length}.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center w-32 h-32">
                    Cloudflare <img src={`${ipfsImg.cf}${ipfsImg.cid}/${ipfsImg.length}.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                  <div className="flex flex-col items-center  w-32 h-32">
                    Dweb <img src={`${ipfsImg.dweb}${ipfsImg.cid}/${ipfsImg.length}.png`} alt="nfts" className="w-32 h-32" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MetaIPFS;
