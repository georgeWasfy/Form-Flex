import { SchemaProperty, UISchema } from '@engine/shared-types';
import { ElementsType, FormElements, INPUT, LAYOUT } from '../types';
import LayoutComponentWrapper from '../Wrappers/LayoutComponentWrapper';
import { ElementRenderer } from './ElementRenderer';
import useDesigner from '../Hooks/useDesigner';
import DesignerComponentWrapper from '../Wrappers/DesignerComponentWrapper';
import FormComponentWrapper from '../Wrappers/FormComponentWrapper';

const layoutObjectGenerator = (uiSchema: UISchema) => {
  return {
    key: uiSchema.key,
    type: uiSchema.type.includes('Layout')
      ? (LAYOUT as typeof LAYOUT)
      : (INPUT as typeof INPUT),
    subtype: uiSchema.type as ElementsType,
    uiSchema: uiSchema,
  };
};

const controlObjectGenerator = ({
  uiSchema,
  elementDataSchema,
}: {
  uiSchema: UISchema;
  elementDataSchema: SchemaProperty;
}) => {
  let subtype = 'TextField';

  switch (Object.values(elementDataSchema)[0].type) {
    case 'string':
      if (uiSchema.variant === 'TextArea') subtype = 'TextAreaField';
      if (uiSchema.variant === 'Date') subtype = 'DateField';
      if (uiSchema.variant === 'SingleSelect') subtype = 'SelectField';
      return {
        key: uiSchema.key,
        type: 'Input' as 'Input',
        subtype: subtype as ElementsType,
        dataSchema: elementDataSchema,
        uiSchema: uiSchema,
      };
    case 'number':
      return {
        key: uiSchema.key,
        type: 'Input' as 'Input',
        subtype: 'NumberField' as ElementsType,
        dataSchema: elementDataSchema,
        uiSchema: uiSchema,
      };
    case 'array':
      return {
        key: uiSchema.key,
        type: 'Input' as 'Input',
        subtype: 'MultiSelectField' as ElementsType,
        dataSchema: elementDataSchema,
        uiSchema: uiSchema,
      };
    case 'object':
      return {
        key: uiSchema.key,
        type: 'Input' as 'Input',
        subtype: 'DateRangeField' as ElementsType,
        dataSchema: elementDataSchema,
        uiSchema: uiSchema,
      };
    default:
      throw new Error('Unknown Control type');
  }
};

export const GenerateDesignerLayout = ({
  uiSchema,
}: {
  uiSchema: UISchema;
}) => {
  const { dataSchema } = useDesigner();
  return (
    <LayoutComponentWrapper
      key={uiSchema.key}
      element={layoutObjectGenerator(uiSchema)}
    >
      {uiSchema.elements?.length ? (
        <ElementRenderer
          uischema={uiSchema.elements}
          dataSchema={dataSchema}
          isDesigner={true}
        />
      ) : null}
    </LayoutComponentWrapper>
  );
};

export const GenerateFormLayout = ({
  uiSchema,
  layoutType,
}: {
  uiSchema: UISchema;
  layoutType: ElementsType;
}) => {
  const { dataSchema } = useDesigner();

  const FormLayout = FormElements[layoutType].formComponent;
  return (
    <FormLayout
      key={uiSchema.key}
      elementInstance={layoutObjectGenerator(uiSchema)}
    >
      {uiSchema?.elements?.length ? (
        <ElementRenderer
          uischema={uiSchema.elements}
          dataSchema={dataSchema}
          isDesigner={false}
        />
      ) : null}
    </FormLayout>
  );
};

export const GenerateDesignerControl = ({
  uiSchema,
  elementDataSchema,
}: {
  uiSchema: UISchema;
  elementDataSchema: SchemaProperty;
}) => {
  let element;
  switch (Object.values(elementDataSchema)[0].type) {
    case 'string':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <DesignerComponentWrapper key={element.key} element={element} />;
    case 'number':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <DesignerComponentWrapper key={element.key} element={element} />;
    case 'array':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <DesignerComponentWrapper key={element.key} element={element} />;
    case 'object':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <DesignerComponentWrapper key={element.key} element={element} />;
    default:
      break;
  }
  return <></>;
};

export const GenerateFormControl = ({
  uiSchema,
  elementDataSchema,
}: {
  uiSchema: UISchema;
  elementDataSchema: SchemaProperty;
}) => {
  let element;
  switch (Object.values(elementDataSchema)[0].type) {
    case 'string':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <FormComponentWrapper key={element.key} element={element} />;
    case 'number':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <FormComponentWrapper key={element.key} element={element} />;
    case 'array':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <FormComponentWrapper key={element.key} element={element} />;
    case 'object':
      element = controlObjectGenerator({ uiSchema, elementDataSchema });
      return <FormComponentWrapper key={element.key} element={element} />;
    default:
      break;
  }
  return <></>;
};
