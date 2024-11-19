"use client"

import * as React from "react"
import DownArrowIcon from "../../../public/images/down-arrow-icon.svg"
import Image from "next/image"

interface Option {
  name: string;
  label: string
  value: string
}

interface CustomSelectProps {
  label?: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
  defaultOptions?: Option[]
  buttonClassName?: string
  dropdownClassName?: string
  icon?: React.ReactNode
}

export default function Component({
  label = "Sort",
  options,
  value,
  onChange,
  className,
  buttonClassName = "flex items-center justify-between gap-2 rounded-full border bg-background px-4 py-2 text-sm w-full hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
  dropdownClassName = "py-1",
  icon = <Image src={DownArrowIcon} alt="down-arrow-icon" width={20} height={20} />
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)
  const [buttonWidth, setButtonWidth] = React.useState<number | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonClassName} ${className || ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
      >
        {label && <span className="text-muted-foreground/80">{label}:</span>}
        <span className="font-medium text-foreground">{selectedOption?.label}</span>
        {icon}
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 top-full z-50 mt-1 rounded-md border bg-popover shadow-md bg-bg-primary-light"
          style={{ width: buttonWidth ? `${buttonWidth}px` : 'auto' }}
        >
          <ul
            className={`${dropdownClassName} text-popover-foreground`}
            role="listbox"
            aria-labelledby="select-label"
            tabIndex={-1}
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                className={`cursor-pointer px-3 py-1.5 text-sm
                  hover:bg-muted/50 focus:bg-muted focus:outline-none text-white
                  ${option.value === value ? 'bg-muted/50 font-medium' : ''}`}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}