import { useState } from "react";

const ReadMore = ({ text, textLimit, textSize }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <div
      className="text mb-0 fontroboto lh-base"
      style={{ wordBreak: "break-word" }}
    >
      {isReadMore && text.length > textLimit ? text.slice(0, textLimit) : text}
      <span
        onClick={toggleReadMore}
        className="read-or-hide"
        style={{ cursor: "pointer", fontSize: textSize }}
      >
        {text.length > textLimit
          ? isReadMore
            ? "... view more"
            : " view less"
          : ""}
      </span>
    </div>
  );
};

export default ReadMore;
