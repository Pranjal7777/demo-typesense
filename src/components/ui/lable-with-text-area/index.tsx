import { appClsx } from '@/lib/utils';
import React, { ChangeEvent, FC } from 'react';

 type Props = {
    label: string,
    name: string,
    required?:boolean,
    error?: string,
    mainClassName?: string,
    labelClassName?: string,
    className?: string,
    errorClassName?: string,
    value?:string;
    changeEvent?: (_e: ChangeEvent<HTMLTextAreaElement>) => void;
    showRequiredOrOptional?: boolean;
    
  }

const LableWithTextArea: FC<Props> = ({label,required,labelClassName,className,mainClassName,name,value,changeEvent,error,errorClassName , showRequiredOrOptional = true}) => {
  return (
    <div className={appClsx('w-full my-[12px]', mainClassName)}>
      <label className={appClsx('text-[14px] sm:font-semibold dark:text-text-secondary-light', labelClassName)} htmlFor={name}>
        {label}
        {showRequiredOrOptional && (required ? '*' : ' (Optional)')}
      </label>
      <textarea
        value={value}
        name={name}
        id={name}
        onChange={changeEvent}
        className={appClsx('w-full resize-none mt-[4px] h-[100px]  dark:bg-bg-primary-dark dark:border-border-tertiary-dark dark:text-text-primary-dark border-border-tertiary-light p-[12px] border rounded-[4px] text-[14px] outline-none', className,{ 'border-error dark:border-error': error })}
      ></textarea>
      {
        error ? <span className={appClsx('text-xs font-normal', errorClassName)} style={{ color: 'red' }}> {error} </span> :null
      }
    </div>
  );
};

export default LableWithTextArea;