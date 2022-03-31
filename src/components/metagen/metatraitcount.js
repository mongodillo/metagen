import React, { useEffect } from "react";

const Metatraitcount = ({ meta, traitCount, countTraits }) => {
  useEffect(() => {
    countTraits(meta);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  return (
    <div className="mt-4">
      <div className="my-5 w-full flex flex-col text-sm border border-accent px-2">
        <div>
          <p className="font-bold text-base">
            Summary of Generated NFTs: <span className="">{Intl.NumberFormat().format(parseInt(meta.length))}</span> NFTs{" "}
          </p>
          <div className="my-5 w-full flex flex-col lg:flex-row lg:flex-wrap place-content-between text-sm">
            {Object.keys(traitCount).map((trait, i) => (
              <div key={`${trait}/${i}`} className="lg:last:mr-1">
                <p className="underline font-bold mt-1 ">{trait}</p>
                {Object.keys(traitCount[trait]).map((option, i) => (
                  <p key={`${trait}/${option}/${i}`} className="whitespace-nowrap">
                    {option}: {traitCount[trait][option]} ({Number((traitCount[trait][option] / meta.length) * 100).toFixed(0)}%)
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metatraitcount;
