export default function PaginationButtons({
  handlePageChange,
  currentPage,
  totalPages,
  className = "flex justify-center mt-4",
}) {
  return (
    <div className={className}>
      <button
        className="mx-1 px-3 py-1 rounded-full enabled:hover:bg-third bg-fourth text-white disabled:opacity-50 disbled:hover:bg-fourth"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        {console.log("CurrentPage and totalPages: ", currentPage, totalPages)}
        {"<<"}
      </button>
      <button
        className="mx-1 px-3 py-1 rounded-full enabled:hover:bg-third bg-fourth text-white disabled:opacity-50 disbled:hover:bg-fourth"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      <button
        className="mx-1 px-3 py-1 rounded-full enabled:hover:bg-third bg-fourth text-white disabled:opacity-50 disbled:hover:bg-fourth"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>

      <button
        className="mx-1 px-3 py-1 rounded-full enabled:hover:bg-third bg-fourth text-white disabled:opacity-50 disbled:hover:bg-fourth"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </button>
    </div>
  )
}
