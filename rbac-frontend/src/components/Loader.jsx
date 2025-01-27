import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader = () => {
  return (
    <div className="flex justify-center items-start h-screen">
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-blue-500 animate-spin sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
      />
    </div>
  );
};

export default Loader;
