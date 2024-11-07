import { button } from "@/components/header/Header";
import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";

const buttonListStyles = cva(["flex items-center justify-center"]);


type ButtonListProps = VariantProps<typeof buttonListStyles> & {
  buttons: button[] | undefined;
  className?: string;
};

const ButtonList = ({ buttons, className, ...props }: ButtonListProps) => {
  return (
    <div className={cn(buttonListStyles({ className }))} {...props}>
      {buttons?.map((button) => (
        <div key={button.id}>{button.Component}</div>
      ))}
    </div>
  );
};

export default ButtonList;
