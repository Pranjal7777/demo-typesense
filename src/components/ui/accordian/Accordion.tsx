"use client";
import { cn } from "@/utils";
import { useState } from "react";
import AccordionItem from "./AccordionItem";

export interface AccordionData {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  data?: AccordionData[];
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  allowMultiple?: boolean;
  initialOpen?: number;
  accordionItemClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  data,
  className,
  headerClassName,
  contentClassName,
  accordionItemClassName,
  allowMultiple = false,
  initialOpen = 0,
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set([initialOpen])
  );

  const toggleItem = (index: number): void => {
    setOpenItems((prev) => {
      const newOpenItems = new Set(prev);
      if (allowMultiple) {
        if (newOpenItems.has(index)) {
          newOpenItems.delete(index);
        } else {
          newOpenItems.add(index);
        }
      } else {
        if (newOpenItems.has(index)) {
          newOpenItems.clear();
        } else {
          newOpenItems.clear();
          newOpenItems.add(index);
        }
      }
      return newOpenItems;
    });
  };

  console.log("accordionItemClassName", accordionItemClassName);
  console.log("className", className);

  return (
    <div className={cn("flex flex-col gap-2 md:gap-4 lg:gap-6", className)} role="list">
      {data?.map((item, index) => (
        <AccordionItem
          key={`accordion-item-${index}`}
          title={item.title}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
          headerClassName={headerClassName}
          contentClassName={contentClassName}
          borderBottom={
            index === data.length - 1
              ? "border-none"
              : "border-b border-gray-200"
          }
          className={accordionItemClassName}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
