import React from "react";
import { getTruncateLength, truncateText } from "../helpers/functions";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BookContext } from "../context/BookContext";
import noImage from "../assets/no-image.png";
import useWindowSize from "../hooks/useWindowSize";

const BookCard = ({ book }: { book: Book }) => {
  const { handleEdit, handleDelete } = React.useContext(
    BookContext
  ) as BookContextType;

  const { width } = useWindowSize();
  const [truncateLength, setTruncateLength] = React.useState<number>(25);

  React.useEffect(() => {
    setTruncateLength(getTruncateLength(width));
  }, [width]);

  const {
    id,
    title,
    author,
    genre,
    publicationYear,
    description,
    image,
    isbn,
    detailUrl,
  } = book;

  return (
    <div className="flex w-[360px] md:w-[380px] lg:w-[600px] h-[240px] md:h-[280px] lg:h-[300px] overflow-hidden shadow-lg relative rounded-xl">
      <img
        className="w-[130px] md:w-[150px] lg:w-[180px] object-fit lg:h-[300px]"
        src={image || noImage}
        alt="Sunset in the mountains"
      />

      <div className="p-3 w-full flex flex-col justify-between relative">
        <div>
          <div className="font-bold text-sm md:text-lg lg:text-xl mb-2 text-center border-b-[1px] border-gray-300">
            {title}
            <span className="flex items-center w-[fit-content] justify-start rounded-full text-[10px] md:text-[14px] font-semibold text-gray-700 mx-auto">
              {author}
            </span>
          </div>
          <p className="text-gray-700 text-[10px] lg:text-[16px] pb-2">
            {truncateText(description, truncateLength)}
            <a
              href={detailUrl}
              target="_blank"
              className="text-blue-400 hover:underline text-[10px] lg:text-sm"
            >
              ...more
            </a>
          </p>
        </div>
        <div className="flex flex-col border-t-[1px] border-gray-300 pt-2 absolute bottom-0 w-[88%] lg:w-[370px] xl:w-[395px] pb-2">
          <div className="flex justify-between">
            <span className="flex items-center w-[fit-content] max-w-[150px] overflow-auto justify-start bg-gray-200 rounded-full px-1 md:px-3 py-1 text-[10px] md:text-md lg:text-[14px] font-semibold text-gray-700">
              #{genre}
            </span>
            <span className="flex items-center w-[fit-content] overflow-auto justify-start rounded-full px-1 md:px-3 py-1 text-[10px] md:text-md lg:text-[14px] text-gray-700">
              First Publication: {publicationYear}
            </span>
          </div>
          <div className="flex justify-between items-center md:px-2">
            <span className="text-[10px] md:text-md lg:text-[14px] mt-2">
              ISBN: {isbn}
            </span>
            <div className="flex items-center mt-1 md:mt-0 justify-center gap-1">
              <RiDeleteBin6Fill
                onClick={() => handleDelete(id)}
                className="text-sm md:text-md lg:text-lg cursor-pointer text-red-500 hover:scale-125 hover:text-red-300"
              />
              <FaEdit
                onClick={() => handleEdit(book)}
                className="text-sm md:text-md lg:text-lg cursor-pointer text-orange-400 hover:scale-125 hover:text-orange-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
