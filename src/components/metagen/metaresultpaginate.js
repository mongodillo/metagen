import React, { useState, useEffect } from "react";

const PaginatedItems = ({ itemsPerPage, nftArray, NftCard, NftGrid, toggleCard }) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(nftArray.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(nftArray.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, nftArray]);

  const handlePageClick = (event) => {
    const { id } = event.target;
    var newOffset;
    var pageNo = currentPage;
    switch (id) {
      case "next":
        pageNo = Math.min(pageNo + 1, pageCount);
        newOffset = ((pageNo - 1) * itemsPerPage) % nftArray.length;
        break;
      case "prev":
        pageNo = Math.max(pageNo - 1, 1);
        newOffset = ((pageNo - 1) * itemsPerPage) % nftArray.length;
        break;
      default:
        pageNo = parseInt(id);
        newOffset = ((pageNo - 1) * itemsPerPage) % nftArray.length;
    }
    setCurrentPage(pageNo);
    setItemOffset(newOffset);
  };

  const PageList = () => {
    const Pages = [];
    if (currentPage > 1 && currentPage < pageCount) {
      for (let i = Math.max(currentPage - 1, 2); i <= Math.min(currentPage + 1, pageCount - 1); i++) {
        Pages.push(i);
      }
    }
    return (
      <>
        <button
          id="1"
          className={`py-2 px-3 text-sm font-medium border  border-primary focus:ring-1 ring-secondary focus:outline-none  ${
            currentPage === 1 ? "bg-primary text-primary-content" : "bg-base-100 hover:bg-primary hover:text-primary-content "
          }`}
          onClick={handlePageClick}
        >
          1
        </button>
        ...
        {pageCount > 1 &&
          Pages.map((pageno) => (
            <button
              key={`PaginationNav/${pageno}`}
              id={pageno}
              className={`py-2 px-3 text-sm font-medium border  border-primary focus:ring-1 ring-secondary focus:outline-none  ${
                currentPage === pageno ? "bg-primary text-primary-content" : "bg-base-100 hover:bg-primary hover:text-primary-content "
              }`}
              onClick={handlePageClick}
            >
              {pageno}
            </button>
          ))}
        ...
        {pageCount > 1 && (
          <button
            id={pageCount}
            className={`py-2 px-3 text-sm font-medium border  border-primary  focus:ring-1 ring-secondary focus:outline-none ${
              currentPage === pageCount ? "bg-primary text-primary-content" : "bg-base-100 hover:bg-primary hover:text-primary-content "
            }`}
            onClick={handlePageClick}
          >
            {pageCount}
          </button>
        )}
      </>
    );
  };

  const PaginatedNav = () => {
    return (
      <div id="paginatedtext" className="flex flex-col items-center ">
        <span className="text-sm  ">
          Showing <span className="font-semibold ">{Intl.NumberFormat().format(parseInt(itemOffset + 1))}</span> to{" "}
          <span className="font-semibold ">{Intl.NumberFormat().format(parseInt(Math.min(itemOffset + itemsPerPage, nftArray.length)))}</span> of{" "}
          <span className="font-semibold ">{Intl.NumberFormat().format(parseInt(nftArray.length))}</span> Entries
        </span>

        <div id="paginatedbuttons" className="inline-flex mt-2 xs:mt-0 mb-5">
          <button
            id="prev"
            onClick={handlePageClick}
            className="py-2 px-4 text-sm font-medium rounded-l-lg text-base-content bg-base-100 border  border-primary hover:bg-primary hover:text-primary-content focus:ring-1 ring-secondary focus:outline-none"
          >
            Prev
          </button>
          {PageList()}
          <button
            id="next"
            onClick={handlePageClick}
            className="py-2 px-4 text-sm font-medium rounded-r-lg text-base-content bg-base-100 border  border-primary hover:bg-primary hover:text-primary-content focus:ring-1 ring-secondary focus:outline-none"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {PaginatedNav()}
      <div id="nftgridcard" className={` flex flex-wrap  mx-1 lg:mx-4 justify-start`}>
        {toggleCard ? <NftCard nftArray={currentItems} /> : <NftGrid nftArray={currentItems} />}
      </div>
    </>
  );
};

export default PaginatedItems;
