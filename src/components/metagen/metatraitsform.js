import React, { useState } from "react";
import { rarityDropdown, rarityWeights } from "../../data/rarityweights";

const Traitsform = ({ getWeights, setToastList, toastList, traits, setTrait }) => {
  const [isChecked, setIsChecked] = useState(Array(15).fill(false));

  const handleCheckedBox = (e, index) => {
    let checkedArray = [...isChecked];
    const updatedIsChecked = checkedArray.map((item, i) => (i === index ? !item : item));
    setIsChecked(updatedIsChecked);

    const { checked } = e.target;
    const list = [...traits];
    const noneObj = { name: "None", weight: "", imgsrc: "", filename: "", rarity: "", max: "" };

    if (checked) {
      list[index].options.push(noneObj);
    } else {
      let objIndex = list[index].options.findIndex((traitoption) => {
        return traitoption.name === noneObj.name;
      });

      if (objIndex !== -1) list[index].options.splice(objIndex, 1);
    }
    setTrait(list);
  };

  const handleTraitChange = (e, index, i) => {
    const { name, value } = e.target;
    const list = [...traits];

    switch (name) {
      case "trait":
        list[index][name] = value;
        setTrait(list);
        break;
      case "name":
        list[index].options[i][name] = value;
        setTrait(list);
        break;
      case "max":
        list[index].options[i][name] = parseInt(Math.max(0, value));
        setTrait(list);
        break;
      case "rarity":
        list[index].options[i][name] = value;
        switch (value) {
          case "None":
            list[index].options[i].weight = rarityWeights[value];
            break;
          case "Common":
            list[index].options[i].weight = rarityWeights[value];
            break;
          case "Uncommon":
            list[index].options[i].weight = rarityWeights[value];
            break;
          case "Rare":
            list[index].options[i].weight = rarityWeights[value];
            break;
          case "Very Rare":
            list[index].options[i].weight = rarityWeights[value];
            break;
          case "Mythical":
            list[index].options[i].weight = rarityWeights[value];
            break;
          default:
            list[index].options[i].weight = 1000;
        }
        setTrait(list);
        break;
      default:
        break;
    }
  };
  const handleImgUpload = async (e, index, i) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const list = [...traits];
      list[index].options[i]["filename"] = files[0].name;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = (e) => {
        list[index].options[i][name] = e.target.result;
      };

      setTrait(list);
    }
  };

  const handleTraitUpload = (e) => {
    const fileReader = new FileReader();
    const { files } = e.target;
    if (files.length > 0) {
      let filename = files[0].name;
      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const JSONdata = JSON.parse(e.target.result);
          if (JSONdata[0].trait === undefined || JSONdata[0].trait === null) {
            setToastList([...toastList, { type: "alert-error", status: "error", message: `${filename} does not contain correct key values` }]);
          } else {
            let checkedArr = [...isChecked];
            checkedArr.fill(false);
            JSONdata.forEach((trait, i) => {
              let noneIndex = trait.options.findIndex((traitoption) => traitoption.name === "None");
              if (noneIndex !== -1) checkedArr[i] = true;
            });

            setIsChecked(checkedArr);
            setTrait(JSONdata);
            setToastList([...toastList, { type: "alert-success", status: "success", message: `${filename} uploaded` }]);
          }
        } catch (err) {
          setToastList([...toastList, { type: "alert-error", status: "error", message: `${err.message}` }]);
        }
      };
    }
    e.target.value = null;
  };

  // handle click event of the Remove button
  const handleRemoveTraits = (index) => {
    const list = [...traits];
    list.splice(index, 1);
    setTrait(list);
  };

  const handleRemoveOption = (index, i) => {
    const list = [...traits];
    list[index].options.splice(i, 1);
    setTrait(list);
  };

  // handle click event of the Add button
  const handleAddTraits = () => {
    setTrait([...traits, { trait: "", options: [{ name: "", weight: "", imgsrc: "", filename: "", rarity: "", max: "" }] }]);
  };
  const handleAddOption = (index) => {
    const list = [...traits];
    list[index].options.push({ name: "", weight: "", imgsrc: "", filename: "", rarity: "", max: "" });
    setTrait(list);
  };

  //save traits to JSON file
  const saveTraits = (jsonData, filename) => {
    const fileData = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="traitsform">
      <h1 className="text-2xl font-bold">Traits Input</h1>

      <div className="flex lg:flex-row flex-col  items-center  justify-between mb-5">
        <div className="flex lg:flex-row flex-col items-center">
          <button
            onClick={() => {
              getWeights(traits);
            }}
            className="my-4 btn btn-primary rounded-full normal-case text-base font-bold btn-sm"
          >
            Generate Weights
          </button>
          <p className="mx-5 italic text-sm "> (click "Generate Weights" before moving to next tab)</p>
        </div>
        <div className="flex lg:flex-row flex-col  items-center ">
          <button
            onClick={() => saveTraits(traits, "weights")}
            className="mx-4 my-4 btn btn-primary rounded-full normal-case text-base font-bold btn-sm"
          >
            Download Traits
          </button>
          <label htmlFor="jsontraitupload" className="my-4 btn btn-primary rounded-full normal-case text-base font-bold btn-sm">
            Upload Traits
          </label>
          <input
            className="hidden"
            id="jsontraitupload"
            type="file"
            name="jsontraits"
            accept=".json,.txt,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleTraitUpload}
          />
        </div>
      </div>

      {traits.map((trait, index) => (
        <div key={`Traits/${index}`}>
          <div className="flex flex-col lg:flex-row text-sm border-accent border rounded-xl mt-2   ">
            <div className="flex flex-col pt-1 items-center lg:items-start  lg:border-r border-accent ">
              <div className="flex flex-row lg:flex-col  ">
                <p className="hidden lg:flex ml-5 h-8 text-sm text-center lg:text-left underline font-semibold  ">Trait Type</p>
                <input
                  className="input input-secondary  w-44 max-w-xs mx-2 lg:text-left text-center"
                  name="trait"
                  value={trait.trait}
                  placeholder="Trait"
                  onChange={(e) => handleTraitChange(e, index)}
                />
              </div>
              {traits.length !== 1 && (
                <button
                  className=" lg:mx-5 lg:mr-10 my-3 lg:my-5 btn btn-primary rounded-full normal-case text-base font-bold btn-sm "
                  onClick={() => handleRemoveTraits(index)}
                >
                  Delete
                </button>
              )}
              <div className="flex flex-row items-center mb-4 ml-2 lg:mt-2 mt-0 ">
                <input
                  id={`traitnonecheckbox${index}`}
                  aria-describedby="traitnonecheckbox"
                  type="checkbox"
                  checked={isChecked[index]}
                  className="checkbox checkbox-xs checkbox-primary"
                  onChange={(e) => {
                    handleCheckedBox(e, index);
                  }}
                />
                <label htmlFor={`traitnonecheckbox${index}`} className="ml-2 text-sm font-semi ">
                  Include "None" option
                </label>
              </div>
            </div>

            <div className="flex flex-col pt-1 lg:ml-2  w-full ">
              <div className="lg:flex lg:flex-row flex-col lg:items-start  hidden">
                <p className="  text-sm text-center lg:text-left underline font-semibold w-28">Trait Options</p>
                <p className=" text-sm text-center lg:text-left underline font-semibold w-28 mx-4">Rarity</p>
                {/*<p className=" text-sm text-center lg:text-left underline font-semibold w-24 mr-4">Max No</p>*/}
              </div>
              {trait.options.map((option, i) => (
                <div key={`Traits/${index}/${i}`}>
                  <div className="flex lg:flex-row flex-col items-center mt-3 w-full justify-between">
                    <div className="flex lg:flex-row flex-col justify-center items-center ">
                      <div className="flex-row flex items-center">
                        <label className="label lg:hidden mr-2 w-20">
                          <span className="label-text">Trait Option:</span>
                        </label>
                        <input
                          className="input input-secondary  w-28 max-w-xs lg:text-left text-center px-0 lg:px-2"
                          name="name"
                          value={option.name}
                          placeholder="Option"
                          onChange={(e) => handleTraitChange(e, index, i)}
                        />
                      </div>
                      <div className="flex-row flex items-center">
                        <label className="label lg:hidden mr-2 w-20">
                          <span className="label-text">Rarity:</span>
                        </label>
                        <select
                          name="rarity"
                          id={`${trait}/${i}/rarity`}
                          value={option.rarity}
                          className="  w-28  lg:ml-4 input input-secondary  px-0 lg:px-2 lg:text-left text-center max-w-xs"
                          onChange={(e) => handleTraitChange(e, index, i)}
                        >
                          {rarityDropdown.map((raritylevel) => (
                            <option value={raritylevel} key={`filter/${trait}/${i}/${raritylevel}`}>
                              {raritylevel}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/*<div className="flex-row flex items-center">
                        <label className="flex lg:hidden mr-2 w-20">Max No:</label>
                        <input
                          type="number"
                          className=" bg-blue-100 text-sm pl-0.5 lg:ml-4 w-24 lg:w-14 border-success border h-8 text-center lg:text-left"
                          name="max"
                          value={option.max}
                          placeholder="Max"
                          onChange={(e) => handleTraitChange(e, index, i)}
                        />
                          </div>*/}
                      <span className="mx-3 items-center flex  h-8 ">{`${String(option.filename).substring(0, 5)}...${String(
                        option.filename
                      ).substring(option.filename.length - 5)}`}</span>
                    </div>

                    <div className=" flex flex-col lg:flex-row   items-center text-center  my-2 ">
                      <div className=" text-center flex flex-row align-middle ">
                        <label htmlFor={`imgupload/${index}/${i}`} className="btn btn-primary rounded-full normal-case text-base font-bold btn-sm">
                          Upload Image
                        </label>
                        <input
                          hidden
                          id={`imgupload/${index}/${i}`}
                          type="file"
                          name="imgsrc"
                          accept="image/*"
                          onChange={(e) => handleImgUpload(e, index, i)}
                        />
                      </div>

                      {trait.options.length !== 1 && (
                        <button
                          className="mx-5  mb-5 mt-2 lg:mb-0 lg:mt-0 btn btn-primary rounded-full normal-case text-base font-bold btn-sm  "
                          onClick={() => handleRemoveOption(index, i)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start">
                    {trait.options.length - 1 === i && (
                      <button
                        onClick={() => handleAddOption(index)}
                        className=" my-4 btn btn-primary rounded-full normal-case text-base font-bold btn-sm"
                      >
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            {traits.length - 1 === index && (
              <button onClick={() => handleAddTraits()} className="mb-4  btn btn-primary rounded-full normal-case text-base font-bold btn-sm">
                Add Trait
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Traitsform;
