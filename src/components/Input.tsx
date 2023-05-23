import React, { memo } from "react";

export const Input = memo(
  ({
    setSearch,
  }: {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    console.log("Input");
    return (
      <>
        <input
          className="Input"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder={`"hello world"`}
        />
      </>
    );
  }
);
