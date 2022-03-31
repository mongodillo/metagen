import { useMemo, useState, useEffect, useContext, createContext } from "react";
import { create } from "ipfs-core";

let ipfs = null;
const repo = `metagen`;

export const IPFSContext = createContext(null);

export const useIPFS = () => {
  const ipfsContext = useContext(IPFSContext);

  return useMemo(() => {
    return ipfsContext;
  }, [ipfsContext]);
};

export const IPFSProvider = ({ children }) => {
  const [ipfsData, setIPFSData] = useState(null);

  const connectIPFS = async (repoName) => {
    if (ipfs) {
      console.log("IPFS already started");
      setIPFSData(ipfs);
    } else if (window.ipfs && window.ipfs.enable) {
      console.log("Found window.ipfs");
      ipfs = await window.ipfs.enable({ commands: ["id"], repo: repoName });
      setIPFSData(ipfs);
    } else {
      try {
        console.time("IPFS Started");
        ipfs = await create({ repo: repoName });
        console.timeEnd("IPFS Started");
      } catch (error) {
        console.error("IPFS init error:", error);
        ipfs = null;
      } finally {
        setIPFSData(ipfs);
      }
    }
  };

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

  useEffect(() => {
    connectIPFS(repo);

    return function cleanup() {
      if (ipfs && ipfs.stop) {
        console.log("Stopping IPFS");
        ipfs.stop().catch((err) => console.error(err));
        ipfs = null;
        deleteDropletDB(repo);
      }
    };
  }, []);

  return <IPFSContext.Provider value={ipfsData}>{children}</IPFSContext.Provider>;
};
