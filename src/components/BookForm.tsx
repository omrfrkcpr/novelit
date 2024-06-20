import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

type BookFormProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  showForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
};

const BookForm: React.FC<BookFormProps> = ({
  form,
  setForm,
  handleSubmit,
  showForm,
  setShowForm,
}) => {
  const [isVisible, setIsVisible] = useState(showForm);

  useEffect(() => {
    if (showForm) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200); // 500ms = fade-out duration
      return () => clearTimeout(timer);
    }
  }, [showForm]);

  return (
    <>
      {isVisible && (
        <div className="w-[100%] h-[100%] bg-white/80 fixed z-50">
          <div
            className={`w-[95%] max-w-[800px] h-auto p-4 bg-white absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] duration-400 transition-opacity  ${
              showForm ? "opacity-100" : "opacity-0"
            }`}
          >
            <IoMdClose
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 w-5 h-5 hover:text-gray-500 cursor-pointer"
            />
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="number"
                  id="isbn"
                  name="isbn"
                  value={form.isbn}
                  onChange={(e) =>
                    setForm({ ...form, isbn: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <label htmlFor="genre">Genre</label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="publicationYear">Publication Year</label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={form.publicationYear}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      publicationYear: parseInt(e.target.value, 10),
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="image">Image</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
              <button type="submit">Submit Book</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookForm;
