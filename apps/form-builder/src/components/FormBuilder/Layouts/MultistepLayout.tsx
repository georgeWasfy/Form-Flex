import { LayoutIcon } from '@radix-ui/react-icons';
import { ReactNode, useEffect, useState } from 'react';
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  FormElements,
} from '../types';
import { Button, Input, Label, Stepper } from '@engine/design-system';
import { Controller, useForm } from 'react-hook-form';
import useDesigner from '../Hooks/useDesigner';
import ShortUniqueId from 'short-unique-id';

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
      activeStep: 1,
    },
  }),
  designerBtnElement: {
    icon: LayoutIcon,
    label: 'Multistep',
  },
  designerComponent: DesignerComponent,

  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const [formStep, setFormStep] = useState(0);
  const { setActiveStep } = useDesigner();
  useEffect(() => {
    setActiveStep(formStep, elementInstance);
  }, [formStep]);
  const totalSteps = elementInstance.uiSchema.elements?.length || 0;
  const activeStep = elementInstance.uiSchema.activeStep || 1;
  const stepsLabels =
    elementInstance.uiSchema.elements?.map((element) => element.label || '') ||
    [];
  const StepLayout =
    FormElements['StepLayout' as ElementsType].designerComponent;
  const steps = elementInstance.uiSchema.elements;
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

  return (
    <div className="grid grid-cols-6 divide-y divide-none min-w-[100px] min-h-[150px] border-secondary border-4">
      <div className="col-start-1 col-end-7">
        <h4 className="font-medium leading-tight text-2xl mt-0 mb-2 text-slate-600">
          <Stepper steps={stepsLabels} activeTabIndex={formStep} />
        </h4>
        {steps?.length && (
          <StepLayout
            key={steps[activeStep - 1].key}
            elementInstance={{
              key: steps[activeStep - 1].key,
              type: 'Layout',
              subtype: 'StepLayout',
              uiSchema: steps[activeStep - 1],
            }}
          />
        )}
      </div>

      <div className="col-start-6 col-end-7">
        <Button
          type="button"
          disabled={formStep <= 0}
          variant={'link'}
          onClick={prevFormStep}
        >
          prev
        </Button>
        <Button
          type="button"
          disabled={formStep >= totalSteps - 1}
          variant={'link'}
          onClick={nextFormStep}
        >
          next
        </Button>
      </div>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const [formStep, setFormStep] = useState(0);
  const { setActiveStep } = useDesigner();
  useEffect(() => {
    setActiveStep(formStep, elementInstance);
  }, [formStep]);
  const totalSteps = elementInstance.uiSchema.elements?.length || 0;
  const activeStep = elementInstance.uiSchema.activeStep || 1;
  const stepsLabels =
    elementInstance.uiSchema.elements?.map((element) => element.label || '') ||
    [];
  const StepLayout = FormElements['StepLayout' as ElementsType].formComponent;
  const steps = elementInstance.uiSchema.elements;
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);
  return (
    <div className="grid grid-cols-6 divide-y divide-none">
      <div className="col-start-1 col-end-7">
        <h4 className="font-medium leading-tight text-2xl mt-0 mb-2 text-slate-600">
          <Stepper steps={stepsLabels} activeTabIndex={formStep} />
        </h4>
        {steps?.length && (
          <StepLayout
            key={steps[activeStep - 1].key}
            elementInstance={{
              key: steps[activeStep - 1].key,
              type: 'Layout',
              subtype: 'StepLayout',
              uiSchema: steps[activeStep - 1],
            }}
          />
        )}
      </div>

      <div className="col-start-6 col-end-7">
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={formStep <= 0}
            variant={'link'}
            onClick={prevFormStep}
          >
            prev
          </Button>
          <Button
            type="button"
            disabled={formStep >= totalSteps - 1}
            variant={'link'}
            onClick={nextFormStep}
          >
            next
          </Button>
        </div>
      </div>
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const StepElement = FormElements['StepLayout'];
  const { addSteps } = useDesigner();
  const form = useForm<any>({
    mode: 'onBlur',
    defaultValues: {
      noOfSteps: elementInstance.uiSchema.elements?.length || 0,
    },
  });
  function updateSchemas(values: { noOfSteps: number }) {
    const uniqueId = new ShortUniqueId({ length: 16 });
    let elements = [];
    for (let index = 0; index < values.noOfSteps; index++) {
      const stepElementInstance = StepElement.construct(uniqueId.rnd());
      elements.push(stepElementInstance.uiSchema);
    }
    addSteps(elementInstance, elements);
  }
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onBlur={form.handleSubmit(updateSchemas)}
      className="space-y-3"
    >
      <div className="flex flex-col">
        <Label className="mb-2">Number of Steps</Label>
        <Controller
          name={`noOfSteps`}
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                }}
                value={field.value}
                placeholder="Label"
                className="w-full"
              />
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>
    </form>
  );
}
