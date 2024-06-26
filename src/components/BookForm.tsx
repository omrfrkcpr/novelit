/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BookContext } from "../context/BookContext";
import spinner from "../assets/loading-spinner.gif";

const formInputFields = [
  { id: "title", label: "Title", length: 40, type: "text" },
  { id: "author", label: "Author", length: 30, type: "text" },
  { id: "isbn", label: "ISBN", type: "text" },
  { id: "genre", label: "Genre", length: 12, type: "text" },
  { id: "publicationYear", label: "Publication Year", type: "number" },
  { id: "image", label: "Image URL", type: "text" },
  { id: "detailUrl", label: "Detail URL", type: "text" },
];

const BookForm = () => {
  const {
    form,
    setForm,
    handleSubmit,
    showForm,
    setShowForm,
    editMode,
    setEditMode,
    initialFormState,
    loading,
  } = React.useContext(BookContext) as BookContextType;

  const [isVisible, setIsVisible] = React.useState(showForm);
  const formDiv = React.useRef<HTMLDivElement>(null);
  const [formFieldLength, setFormFieldLength] = useState<{
    [key: string]: number;
  }>({
    title: 0,
    author: 0,
    description: 0,
    genre: 0,
  });

  React.useEffect(() => {
    const updatedFormFieldLength = formInputFields.reduce((acc, field) => {
      if (field.length) {
        acc[field.id] = form[field.id]?.length || 0;
      }
      return acc;
    }, {} as { [key: string]: number });

    updatedFormFieldLength.description = form.description?.length || 0;

    setFormFieldLength(updatedFormFieldLength);
  }, [form]);

  React.useEffect(() => {
    if (showForm) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showForm]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const errorModal = document.querySelector(".swal2-container"); // if any error exist, func should not be triggered.
      if (
        formDiv.current &&
        !formDiv.current.contains(event.target as Node) &&
        !errorModal
      ) {
        setShowForm(false);
        setForm(initialFormState);
        setEditMode(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm, setShowForm, setForm, setEditMode, initialFormState]);

  const handleFormClose = () => {
    setForm(initialFormState);
    setShowForm(false);
    setEditMode(false);
  };

  const renderFormFields = () =>
    formInputFields.map((field) => (
      <div className="space-x-2 flex justify-between" key={field?.id}>
        <label
          className="text-sm md:text-md w-[230px] md:w-[190px]"
          htmlFor={field?.id}
        >
          {field?.label}:
        </label>
        <input
          type={field?.type}
          id={field?.id}
          className="outline-none border border-gray-500 px-3 text-sm md:py-1 w-[100%]"
          name={field.id}
          maxLength={field["length"] && field?.length}
          value={form?.[field?.id] || ""}
          required
          onChange={(e) => {
            setForm({
              ...form,
              [field?.id]:
                field?.type === "number" ? +e.target.value : e.target.value,
            });
            if (field["length"]) {
              setFormFieldLength({
                ...formFieldLength,
                [field?.id]: e.target.value.length,
              });
            }
          }}
        />

        <div className="w-[125px] text-xs md:text-md text-left text-gray-600">
          {field["length"] &&
            `${formFieldLength?.[field?.id]}/${field["length"]}`}
        </div>
      </div>
    ));

  return (
    <>
      {isVisible && (
        <div className="w-[100%] h-[100%] bg-white/80 fixed z-50">
          <div
            ref={formDiv}
            className={`w-[96%] max-w-[600px] h-auto p-5 md:p-10 bg-red-100 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] duration-400 transition-opacity shadow-xl ${
              showForm ? "opacity-100" : "opacity-0"
            }`}
          >
            <IoMdClose
              onClick={handleFormClose}
              className="absolute top-2 right-2 w-5 h-5 hover:text-gray-500 cursor-pointer"
            />
            <form
              className="flex flex-col space-y-2 mb-4"
              onSubmit={handleSubmit}
            >
              <div className="text-2xl text-center mb-4 border-b border-gray-400">
                Book Information
              </div>
              {renderFormFields()}
              <div className="space-x-2 flex justify-between">
                <label
                  htmlFor="description"
                  className="text-sm md:text-md w-[230px] md:w-[190px]"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="outline-none border resize-none border-gray-500 px-2 text-sm md:py-1 w-[100%] overflow-auto scrollbar-none"
                  rows={5}
                  maxLength={1300}
                  required
                  value={form?.description || ""}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      description: e.target.value,
                    });

                    setFormFieldLength({
                      ...formFieldLength,
                      description: e.target.value.length,
                    });
                  }}
                ></textarea>
                <div className="w-[125px] text-xs md:text-md text-left text-gray-600">
                  {`${formFieldLength.description}/1300`}
                </div>
              </div>
              <div className="text-center">
                <button
                  disabled={loading}
                  className={`${
                    loading ? "py-0" : "py-1"
                  } px-3 w-[130px] mt-5 rounded-xl text-white transition-all cursor-pointer ${
                    editMode
                      ? "bg-orange-400 hover:bg-orange-300"
                      : "bg-green-600 hover:bg-green-300"
                  }`}
                  type="submit"
                >
                  {loading ? (
                    <span className="flex justify-center items-center">
                      <span>Loading...</span>
                      <img
                        src={spinner}
                        alt="loading-spinner"
                        className="mx-auto w-[24px] h-[24px] text-center"
                      />
                    </span>
                  ) : editMode ? (
                    "Update Book"
                  ) : (
                    "Add Book"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookForm;
