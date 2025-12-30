import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
    totalPages: number; 
    currentPage: number; 
    onSelectPage: (page: number) => void; 
}

export default function Pagination({
    totalPages,
    currentPage,
    onSelectPage,
}: PaginationProps) {
    return (
        <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => onSelectPage(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        disabledClassName={css.disabled}
        />
    );
}

