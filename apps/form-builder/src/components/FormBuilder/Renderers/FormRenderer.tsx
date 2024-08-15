import { UISchema, DataSchema, ControlEffect } from '@engine/shared-types';
import { Button } from '@engine/design-system';
import { ElementRenderer } from './ElementRenderer';
import useDesigner from '../Hooks/useDesigner';
import { useEffect, useState } from 'react';
import { evaluateRule } from '../SchemaBuilder/helpers';
import { EffectMap } from '../types';
import useCustomeForm from '../Hooks/useForm';

const FormRenderer = ({
  dataSchema,
  uiSchema,
  isDesigner = true,
}: {
  dataSchema: DataSchema;
  uiSchema?: UISchema;
  isDesigner: boolean;
}) => {
  const [forceRender, setForceRender] = useState(false);
  const { form } = useCustomeForm();
  const { elementsToWatch, uiElementsState } = useDesigner();

  // Handle Rules
  // TODO: if element removed from ui remove its value from for object
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        type === 'change' &&
        name &&
        Array.from(elementsToWatch.keys()).includes(name)
      ) {
        const result = evaluateRule(
          value[name],
          elementsToWatch.get(name)?.rule!
        );
        const elementRule = elementsToWatch.get(name);
        if (result) {
          elementRule &&
            uiElementsState.set(
              elementRule.dependableElementName,
              elementRule?.rule?.effect!
            );
        } else {
          elementRule &&
            uiElementsState.set(
              elementRule.dependableElementName,
              EffectMap.get(elementRule?.rule?.effect!) as ControlEffect
            );
        }
        setForceRender((prevCheck) => !prevCheck);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 4));
  };
  return (
    <div className="w-full h-full">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {dataSchema && uiSchema && (
          <ElementRenderer
            uischema={[uiSchema]}
            dataSchema={dataSchema}
            isDesigner={isDesigner}
          />
        )}
        {!isDesigner && (
          <div className="flex flex-row mt-10">
            <Button
              type="submit"
              variant="default"
              size="default"
              className="ml-auto hidden h-8 lg:flex px-5 py-3 bg-gray-400 text-white"
            >
              Submit
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormRenderer;
