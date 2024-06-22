/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const BookContext = createContext<BookContextType | undefined>(
  undefined
);

const initialFormState: Form = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  publicationYear: 0,
  description: "",
  image: "",
  detailUrl: "",
};

export const BookProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [form, setForm] = useState<Form>(initialFormState);
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editBookId, setEditBookId] = useState<string>("");

  const getBooksData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_HOST}:${
        import.meta.env.VITE_SERVER_PORT
      }/books`
    );
    setBooks(response.data.books);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMode) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Book Informations will be permanently updated",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#FDBA74",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        try {
          await axios.put(
            `${import.meta.env.VITE_SERVER_HOST}:${
              import.meta.env.VITE_SERVER_PORT
            }/books/${editBookId}`,
            form
          );
          Swal.fire({
            title: "Success!",
            text: "Book is successfully updated!",
            icon: "success",
          });
          setEditMode(false);
          setShowForm(false);
          setForm(initialFormState);
          getBooksData();
        } catch (error: any) {
          console.log(error);
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "error",
          });
        }
      }
    } else {
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_HOST}:${
            import.meta.env.VITE_SERVER_PORT
          }/books`,
          form
        );
        Swal.fire({
          title: "Success!",
          text: "New Book is successfully added!",
          icon: "success",
        });
        getBooksData();
        setForm(initialFormState);
        setShowForm(false);
      } catch (error: any) {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#37901e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_HOST}:${
            import.meta.env.VITE_SERVER_PORT
          }/books/${id}`
        );
        Swal.fire({
          title: "Deleted!",
          text: "Book has been successfully deleted.",
          icon: "success",
        });
        getBooksData();
      } catch (error: any) {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
        });
      }
    }
  };

  const handleEdit = (oldBook: Book) => {
    setForm(oldBook);
    setEditMode(true);
    setEditBookId(oldBook.id);
    setShowForm(true);
  };

  useEffect(() => {
    getBooksData();
  }, []);

  const contextValues = {
    form,
    setForm,
    books,
    getBooksData,
    handleSubmit,
    handleDelete,
    handleEdit,
    showForm,
    setShowForm,
    editMode,
    setEditMode,
    initialFormState,
  };

  return (
    <BookContext.Provider value={contextValues}>
      {children}
    </BookContext.Provider>
  );
};
