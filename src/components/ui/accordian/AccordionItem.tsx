import { ArrowDown } from "@/constants/svgs";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  borderBottom?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  className,
  headerClassName,
  contentClassName,
  borderBottom,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? scrollHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div className={cn(borderBottom, className)}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between p-4 text-left",
          "hover:bg-gray-50 focus:outline-none rounded-lg",
          headerClassName
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <ArrowDown
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          )}
          aria-hidden="true"
        />
      </button>
      <div
        ref={contentRef}
        style={{ height: height ? `${height}px` : "0px" }}
        className={cn(
          "overflow-hidden transition-[height] duration-300 ease-in-out",
          contentClassName
        )}
        role="region"
        aria-labelledby={`accordion-header-${title}`}
      >
        <div className="p-4 text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
