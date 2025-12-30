"use client";

import { useState } from "react";
import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/app/lib/api";
import Pagination from "@/app/components/Pagination/Pagination";
import NoteList from "@/app/components/NoteList/NoteList";
import Modal from "@/app/components/Modal/Modal";
import NoteForm from "@/app/components/NoteForm/NoteForm";
import SearchBox from "@/app/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce"

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    
    const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
    placeholderData: keepPreviousData,
});
    
    const totalPages = data?.totalPages ?? 0;

    const handleChangeQuery = useDebouncedCallback((query: string) => {
        setQuery(query);
        setCurrentPage(1);
}, 500);

const openModal = () => {
    setIsModalOpen(true);
};

const closeModal = () => {
    setIsModalOpen(false);
}

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={query} onChange={handleChangeQuery} />
                {isSuccess && totalPages > 1 && (
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onSelectPage={setCurrentPage}
                    />
                )}
                <button onClick={openModal} className={css.button}>
                    Create note +
                </button>
            </header>
            {isError && <div>Error. Try again.</div>}
            {isLoading && <div> Data is loading ...</div>}
            {isSuccess && data.notes.length === 0 && (
                <div>Data not found. Please try other query.</div>
            )}
            {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NoteForm onClose={closeModal} />
                </Modal>
            )}
        </div>
    )
}


