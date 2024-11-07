import React, { ChangeEvent, FC, FocusEventHandler, KeyboardEventHandler } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

interface CustomSearchBoxProps {
  currentRefinement: string;
  refine: (value: string) => void;
  extraStyles?: string;
  name?: string;
  inputValue?: string;
  placeholder?: string;
  onChangeHandeler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusHandeler?: FocusEventHandler<HTMLInputElement>;
  onBlurHandeler?: FocusEventHandler<HTMLInputElement>;
  onKeyDownHandeler?: KeyboardEventHandler<HTMLInputElement>;
}

const SearchBox: FC<CustomSearchBoxProps> = ({ currentRefinement, refine, extraStyles, name, inputValue, placeholder, onChangeHandeler, onFocusHandeler, onBlurHandeler, onKeyDownHandeler }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    refine(e.target.value);
  };

  return (
    <input
      type="text"
      value={inputValue} 
      onChange={(e) => {
        if (onChangeHandeler) onChangeHandeler(e);
        handleChange(e);
      }}
      placeholder={placeholder}
      className={extraStyles}
      name={name}
      onFocus={onFocusHandeler}
      onBlur={onBlurHandeler}
      onKeyDown={onKeyDownHandeler}
      autoComplete="off"
    />
  );
};

// Use the `connectSearchBox` HOC to link with InstantSearch
export default connectSearchBox(SearchBox);
