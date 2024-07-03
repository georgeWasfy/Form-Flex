import {
  UISchema,
  DataSchema,
  SchemaProperty,
  ControlEffect,
} from '@engine/shared-types';
import { getElementDataSchemaByScope } from '../SchemaBuilder/helpers';
import useDesigner from '../Hooks/useDesigner';
import { EffectMap } from '../types';
import {
  GenerateDesignerControl,
  GenerateDesignerLayout,
  GenerateFormControl,
  GenerateFormLayout,
} from './ElementFactory';

export const ElementRenderer = ({
  uischema,
  dataSchema,
  isDesigner,
}: {
  uischema: UISchema[];
  dataSchema: any;
  isDesigner: boolean;
}) => {
  const { elementsToWatch, uiElementsState } = useDesigner();

  return (
    <>
      {uischema.map((el) => {
        switch (el.type) {
          case 'VerticalLayout':
            return isDesigner ? (
              <GenerateDesignerLayout uiSchema={el} key={el.key} />
            ) : (
              <GenerateFormLayout
                uiSchema={el}
                layoutType="VerticalLayout"
                key={el.key}
              />
            );
          case 'HorizontalLayout':
            return isDesigner ? (
              <GenerateDesignerLayout uiSchema={el} key={el.key} />
            ) : (
              <GenerateFormLayout
                uiSchema={el}
                layoutType="HorizontalLayout"
                key={el.key}
              />
            );
          case 'GroupAccordionLayout':
            return isDesigner ? (
              <GenerateDesignerLayout uiSchema={el} key={el.key} />
            ) : (
              <GenerateFormLayout
                uiSchema={el}
                layoutType="GroupAccordionLayout"
                key={el.key}
              />
            );
          case 'MultistepLayout':
            return isDesigner ? (
              <GenerateDesignerLayout uiSchema={el} key={el.key} />
            ) : (
              <GenerateFormLayout
                uiSchema={el}
                layoutType="MultistepLayout"
                key={el.key}
              />
            );
          case 'StepLayout':
            return el?.elements?.length ? (
              <ElementRenderer
                key = {el.key}
                uischema={el.elements}
                dataSchema={dataSchema}
                isDesigner={isDesigner}
              />
            ) : null;
          case 'Control':
            const scope = el.scope;
            if (
              el.rule?.condition?.scope &&
              !elementsToWatch.has(el.rule?.condition?.scope?.split('/').pop()!)
            ) {
              elementsToWatch.set(
                el.rule?.condition?.scope?.split('/').pop()!,
                {
                  rule: el.rule,
                  dependableElementName: el.name,
                }
              );
              uiElementsState.set(
                el.name,
                EffectMap.get(el.rule.effect!) as ControlEffect
              );
            }
            const elementSchemaProperties = getElementDataSchemaByScope(
              scope || '',
              dataSchema as DataSchema
            );
            const elementDataSchema = {
              [el.name ?? el.key]: elementSchemaProperties,
            } as SchemaProperty;
            return isDesigner ? (
              <GenerateDesignerControl
                uiSchema={el}
                key={el.key}
                elementDataSchema={elementDataSchema}
              />
            ) : (
              <GenerateFormControl
                uiSchema={el}
                key={el.key}
                elementDataSchema={elementDataSchema}
              />
            );
        }
      })}
    </>
  );
};
