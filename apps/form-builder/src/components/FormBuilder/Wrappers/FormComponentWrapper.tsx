import { ControlEffect } from '@engine/shared-types';
import { FormElementInstance, FormElements } from '../types';
const FormComponentWrapper = ({
  element,
  effect,
}: {
  element: FormElementInstance;
  effect?: ControlEffect;
}) => {
  const FormElement = FormElements[element.subtype].formComponent;
  return (
    <div className="w-full">
      <FormElement elementInstance={element} effect={effect} />
    </div>
  );
};

export default FormComponentWrapper;
