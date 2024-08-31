import React, { useRef } from "react";
import { ImAttachment } from "react-icons/im";

const FileInputButton = ({ onChange }: { onChange: React.ChangeEventHandler<HTMLInputElement> }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className=" w-96 h-20 rounded-xl flex items-center justify-center text-sm gap-2 cursor-pointer" onClick={handleClick}>
      <ImAttachment className="w-4 h-3" />
      <input
        ref={inputRef}
        type="file"
        name="file"
        id="imageInput"
        accept="image/*"
        multiple
        onChange={onChange}
        className="hidden"
      />
      Add up to 4 screenshots
      <button type="button" className="text-center leading-none" >
      </button>
    </div>
  );
};

export default FileInputButton