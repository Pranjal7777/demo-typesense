import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';
type Props = {
  title?: string;
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  containerClassName?: string;
  className?: string;
  buttonContainerClassName?: string;
  cancelButtonClassName?: string;
  confirmButtonClassName?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  titleClassName?: string;
  messageClassName?: string;
};
const ConfirmationPopup: FC<Props> = ({
  isOpen,
  message,
  onClose,
  onConfirm,
  containerClassName,
  className,
  buttonContainerClassName,
  cancelButtonClassName,
  confirmButtonClassName,
  cancelButtonText,
  confirmButtonText,
  title,
  titleClassName,
  messageClassName,
}) => {
  return (
    <div
      className={appClsx(
        `fixed z-50 flex h-[100vh] w-[100vw] items-center justify-center bg-gray-700 bg-opacity-40 ${
          !isOpen ? 'hidden' : ''
        }`,
        containerClassName
      )}
    >
      <div className={appClsx('w-[95%] max-w-[480px] relative bg-white rounded-lg p-8 shadow-lg z-[200] ', className)}>
        {title && (
          <h2 className={appClsx('font-semibold mb-2 mobile:text-center text-xl', titleClassName)}>{title}</h2>
        )}
        {message && (
          <p className={appClsx('text-sm md:text-base mobile:text-center mb-8 text-text-tertiary-light dark:text-text-septenary-light', messageClassName)}>{message}</p>
        )}
        <div className={appClsx('flex justify-between gap-4', buttonContainerClassName)}>
          <button
            onClick={onClose}
            className={appClsx(
              'w-full h-11 border-brand-color border bg-transparent text-brand-color rounded',
              cancelButtonClassName
            )}
          >
            {cancelButtonText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className={appClsx('w-full h-11 bg-brand-color text-white rounded', confirmButtonClassName)}
          >
            {confirmButtonText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
