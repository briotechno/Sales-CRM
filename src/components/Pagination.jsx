import React from "react";

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const filteredPolicies = policies
        .filter((p) => activeTab === "All" || p.status === activeTab)
        .filter((p) => filterCategory === "All" || p.category === filterCategory)
        .filter((p) => filterStatus === "All" || p.status === filterStatus);

    const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentPolicies = filteredPolicies.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="flex justify-end items-center gap-3 mt-6">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#FF7B1D] hover:opacity-90"
                    }`}
            >
                Back
            </button>

            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded-sm text-black font-semibold border transition ${currentPage === i + 1
                            ? "bg-gray-200 border-gray-400"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#22C55E] hover:opacity-90"
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
