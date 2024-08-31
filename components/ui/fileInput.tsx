import React, { useRef, useState } from "react";
import { ImAttachment } from "react-icons/im";

const FileInput = ({ onChange }: { onChange: React.ChangeEventHandler<HTMLInputElement> }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className=" rounded-full w-[4rem] h-[4rem] flex items-center text-center justify-center text-xs cursor-pointer border" onClick={handleClick}>
      <ImAttachment className="w-4 h-4" />
      <input
        ref={inputRef}
        type="file"
        name="file"
        id="resumeInput"
        accept="application/pdf"
        multiple
        onChange={onChange}
        className="hidden"
      />

    </div>
  );
};

export default FileInput