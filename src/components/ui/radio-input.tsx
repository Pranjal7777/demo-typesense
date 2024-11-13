import { appClsx } from '@/lib/utils';
import React, { FC, ChangeEvent } from 'react';

type Props = {
  id: string,
  value:string,
  name: string,
  mainClassName?: string,
  children?: React.ReactNode,
  className?: string,
  inputClassName?: string,
  onChange?: (_e: ChangeEvent<HTMLInputElement>) => void, 
  checked?:boolean, 
}

const RadioInput: FC<Props> = ({ children, value, id, name, mainClassName, className, inputClassName, onChange, checked, ...props }) => {
  return (
    <div className={appClsx('flex gap-[10px] cursor-pointer', mainClassName)}>
      <input
        value={value}
        className={appClsx(
          'w-[20px] h-[20px] cursor-pointer appearance-none border rounded-full accent-brand-color',
          checked ? ' border-white bg-brand-color ' : 'border-gray-300 bg-white',
          inputClassName
        )}
        name={name}
        id={id}
        type="radio"
        onChange={onChange}
        checked={checked}
        {...props}
      />
      <span className={appClsx('flex gap-[2px]', className)}>
        {children}
      </span>
    </div>
  );
};

export default RadioInput;
