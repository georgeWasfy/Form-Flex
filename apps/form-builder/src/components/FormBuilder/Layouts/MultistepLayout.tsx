import { LayoutIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';
import { FormElement, FormElementInstance } from '../types';
import { Stepper } from '@engine/design-system';

export const MiltistepLayoutElement: FormElement = {
  type: 'MultistepLayout',
  construct: (key: string) => ({
    key,
    type: 'Layout',
    subtype: 'MultistepLayout',
    uiSchema: {
      key,
      name: key,
      type: 'MultistepLayout',
      label: 'Multistep',
      elements: [],
    },
  }),
  designerBtnElement: {
    icon: LayoutIcon,
    label: 'Multistep',
  },
  designerComponent: DesignerComponent,

  formComponent: FormComponent,
  propertiesComponent: () => <div>Designer component</div>,
};

function DesignerComponent({
  children,
  elementInstance,
}: {
  elementInstance: FormElementInstance;
  children?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 divide-y divide-none min-w-[100px] min-h-[150px] border-secondary border-4">
      <h4 className="font-medium leading-tight text-2xl mt-0 mb-2 text-slate-600">
        <Stepper steps={['step1', 'step2']} activeTabIndex={0} />
      </h4>
      {children}
    </div>
  );
}

function FormComponent({
  children,
  elementInstance,
}: {
  elementInstance: FormElementInstance;
  children?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 divide-y divide-none">
      <h4 className="font-medium leading-tight text-2xl mt-0 mb-2 text-slate-600">
        <Stepper steps={['step1', 'step2']} activeTabIndex={0} />
      </h4>
      {children}
    </div>
  );
}
