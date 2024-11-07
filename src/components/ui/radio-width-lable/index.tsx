import { appClsx } from '@/lib/utils';
import React, { FC, ChangeEvent } from 'react';

type Props = {
  label: string,
  id: string,
  value:string,
  name: string,
  mainClassName?: string,
  children?: React.ReactNode,
  className?: string,
  inputClassName?: string,
  labelClassName?: string,
  onChange?: (_e: ChangeEvent<HTMLInputElement>) => void, 
  checked?:boolean,
  
}

const RadioWidthLable: FC<Props> = ({ children, label,value, id, name, mainClassName, className, inputClassName, labelClassName, onChange, ...props }) => {
  return (
    <div className={appClsx('flex gap-[10px] cursor-pointer', mainClassName)}>
      <input value={value} className={appClsx('w-[20px] h-[20px] cursor-pointer', inputClassName)} name={name} id={id} type="radio" onChange={onChange} {...props} />
      <span className={appClsx('flex gap-[2px]', className)}>
        {children}
        <label className={appClsx('cursor-pointer', labelClassName)} htmlFor={id}> {label}</label>
      </span>
    </div>
  );
};

export default RadioWidthLable;
