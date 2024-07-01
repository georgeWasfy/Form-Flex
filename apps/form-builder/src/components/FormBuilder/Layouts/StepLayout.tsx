import { LayoutIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';
import { FormElement, FormElementInstance } from '../types';

export const StepLayoutElement: FormElement = {
  type: 'StepLayout',
  construct: (key: string) => ({
    key,
    type: 'Layout',
    subtype: 'StepLayout',
    uiSchema: {
      key,
      name: key,
      type: 'StepLayout',
      label: 'Step',
      elements: [],
    },
  }),
  designerBtnElement: {
    icon: LayoutIcon,
    label: 'Step',
  },
  designerComponent: DesignerComponent,

  formComponent: FormComponent,
  propertiesComponent: () => <div>Designer component</div>,
};
function DesignerComponent({
  elementInstance,
  isHidden
}: {
    elementInstance: FormElementInstance;
    isHidden?: boolean;
}) {
  return (
    <>
      <div className={`border-secondary border-4 ${isHidden ? 'hidden' : ''}`}>single step</div>
    </>
  );
}

function FormComponent({
  children,
  elementInstance,
}: {
  elementInstance: FormElementInstance;
  children?: ReactNode;
}) {
  return <>{children}</>;
}
