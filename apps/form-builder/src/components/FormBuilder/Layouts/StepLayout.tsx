import { LayoutIcon } from '@radix-ui/react-icons';
import { FormElement, FormElementInstance } from '../types';
import { ElementRenderer } from '../Renderers/ElementRenderer';
import useDesigner from '../Hooks/useDesigner';

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
}: {
  elementInstance: FormElementInstance;
}) {
  const { dataSchema } = useDesigner();
  return (
    <ElementRenderer
      uischema={[elementInstance.uiSchema]}
      dataSchema={dataSchema}
      isDesigner={true}
    />
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { dataSchema } = useDesigner();
  return (
    <ElementRenderer
      uischema={[elementInstance.uiSchema]}
      dataSchema={dataSchema}
      isDesigner={false}
    />
  );
}
