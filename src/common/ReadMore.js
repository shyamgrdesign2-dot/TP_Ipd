import { useState } from "react";

const ReadMore = ({ text, textLimit }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="text mb-0 fontroboto lh-base">
      {isReadMore && text.length > textLimit ? text.slice(0, textLimit) : text}
      <span
        onClick={toggleReadMore}
        className="read-or-hide"
        style={{ cursor: "pointer" }}
      >
        {text.length > textLimit
          ? isReadMore
            ? "... View More"
            : " View Less"
          : ""}
      </span>
    </p>
  );
};

export default ReadMore;
