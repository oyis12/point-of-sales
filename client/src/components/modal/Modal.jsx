
import React from "react";

const Modal = ({ title, content, toggleModal }) => {
  return (
    <div
      id="static-modal"
      data-modal-backdrop="static"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-200 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-80"
    >
      <div className="relative p-4 w-full max-w-xl">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 ">{title}</h3>
            <button
              type="button"
              className=""
              data-modal-hide="static-modal"
              onClick={toggleModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="black"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
