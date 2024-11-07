import React, { FC } from 'react';
type Props = {
    isOpen:boolean,
    message:string,
    onClose:()=>void,
    onConfirm:()=>void,
}
const ConfirmationPopup:FC<Props> = ({ isOpen, message, onClose, onConfirm }) => {
  return (
    <div
      className={`fixed z-50 flex h-[100vh] w-[100vw] items-center justify-center bg-gray-700 bg-opacity-40 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="w-[95%] max-w-[480px] relative bg-white rounded-lg p-8 shadow-lg">
        <h2 className="font-semibold mb-4">{message}</h2>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-brand-color text-white rounded mr-3"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
