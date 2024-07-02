import { useContext } from 'react';
import { FormContext } from '../Context/FormContext';

const useCustomeForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form Hook Cant be used outside form context');
  }
  return context;
};

export default useCustomeForm;
