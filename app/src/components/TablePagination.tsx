import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface TablePaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function TablePagination({
    currentPage,
    totalPages,
    onPageChange,
}: TablePaginationProps) {
    if (totalPages <= 1) return null

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1)
    }

    return (
        <div className="mt-4 flex justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={handlePrev}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink
                            isActive={currentPage === 1}
                            onClick={() => onPageChange(1)}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>

                    {currentPage > 3 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => Math.abs(page - currentPage) <= 1 && page !== 1 && page !== totalPages)
                        .map(page => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                    {currentPage < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationLink
                            isActive={currentPage === totalPages}
                            onClick={() => onPageChange(totalPages)}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNext}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
