import React, { useRef, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { Button } from "@/components/ui/button";

const DataFileInput = ({ onChange }: { onChange: React.ChangeEventHandler<HTMLInputElement> }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Button variant="secondary" size="sm" className="h-8 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 delay-100" onClick={handleClick}>
      Add candidates
      {/* <ImAttachment className="w-4 h-4" /> */}
      <input
        ref={inputRef}
        type="file"
        name="file"
        id="resumeInput"
        accept=".xlsx, .csv"
        multiple
        onChange={onChange}
        className="hidden"
      />
    </Button>
  );
};

export default DataFileInput