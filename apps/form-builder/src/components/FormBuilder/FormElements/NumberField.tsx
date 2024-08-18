import { Input, Label } from '@engine/design-system';
import { UISchema, SchemaProperty, ControlEffect } from '@engine/shared-types';
import { TextNoneIcon } from '@radix-ui/react-icons';
import { Controller, useForm } from 'react-hook-form';
import { buildConditionObject, findPath } from '../SchemaBuilder/helpers';
import useDesigner from '../Hooks/useDesigner';
import { FormElement, FormElementInstance, Operator } from '../types';
import useCustomeForm from '../Hooks/useForm';
import PropertiesForm from '../ElementProperties/PropertiesForm';

export const NumberFieldFormElement: FormElement = {
  type: 'NumberField',
  construct: (key: string) => ({
    key,
    type: 'Input',
    subtype: 'NumberField',
    dataSchema: {
      [key]: {
        key,
        type: 'number',
        pattern: '',
        default: '',
        prefix: '',
        suffix: '',
        input: 'number',
        description: 'This is Element Description',
        errorMessage: {
          type: 'Custom: Type must be number',
          minimum: 'Custom: This field have minimum',
          maximum: 'Custom: This field have maximum',
          pattern: 'Custom: The field does not comply with specified pattern ',
        },
      },
    },
    uiSchema: {
      key,
      type: 'Control',
      required: true,
      name: key,
      label: '',
      placeholder: 'Input Placeholder',
      scope: `#/properties/${key}`,
    },
  }),
  designerBtnElement: {
    icon: TextNoneIcon,
    label: 'Number  field',
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
  const elementName = elementInstance.uiSchema.name;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label variant={'base'}>
        {elementInstance.uiSchema.label}
        <span className="text-error">
          {elementInstance.uiSchema.required && '*'}
        </span>
      </Label>
      <span className="flex items-center">
        {elementInstance.dataSchema &&
          elementInstance.dataSchema[elementName].prefix}
        <Input
          readOnly
          disabled
          type={'number'}
          placeholder={elementInstance.uiSchema.placeholder}
          className="bg-gray-600"
        />
        {elementInstance.dataSchema &&
          elementInstance.dataSchema[elementName].suffix}
      </span>
      {elementInstance.dataSchema &&
        elementInstance.dataSchema[elementName]?.description && (
          <p className="text-base-100 text-[0.8rem]">
            {elementInstance.dataSchema[elementName]?.description}
          </p>
        )}
    </div>
  );
}

function FormComponent({
  elementInstance,
  effect,
}: {
  elementInstance: FormElementInstance;
  effect?: ControlEffect;
}) {
  const elementKey = elementInstance.uiSchema.key;
  const elementName = elementInstance.uiSchema.name;
  const { form } = useCustomeForm();

  return (
    <div
      className={`"flex flex-col gap-2 w-full" ${
        effect === 'HIDE' ? 'hidden' : ''
      } ${effect === 'DISABLE' ? 'pointer-events-none opacity-80' : ''}`}
    >
      <Label>
        {elementInstance.uiSchema.label}
        <span className="text-error">
          {elementInstance.uiSchema.required && '*'}
        </span>
      </Label>
      <Controller
        name={`${elementName}`}
        control={form?.control}
        render={({ field, fieldState }) => (
          <>
            <Input
              type={'number'}
              placeholder={elementInstance.uiSchema.placeholder}
              defaultValue={0}
              {...field}
              value={field.value}
              onChange={(v) => field.onChange(+v.target.value)}
              disabled={effect === 'DISABLE'}
            />
            {fieldState.error?.message && (
              <Label variant={'error'}>{fieldState.error?.message}</Label>
            )}
          </>
        )}
      />

      {elementInstance.dataSchema &&
        elementInstance.dataSchema[elementKey]?.description && (
          <p className="text-text text-[0.8rem]">
            {elementInstance.dataSchema[elementKey]?.description}
          </p>
        )}
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { updateElementSchemas, elementsMap, dataSchema } = useDesigner();
  function updateSchemas(values: {
    uiSchema: UISchema;
    dataSchema: SchemaProperty;
    formRules: {
      operator: Operator;
      value: string;
    }[];
  }) {
    const newName = values.uiSchema.name;
    const oldScope = values.uiSchema.scope;
    const scopeArr = oldScope?.split('/');
    const oldName = scopeArr?.pop();
    let newScope;
    if (scopeArr) {
      scopeArr.push(newName);
      newScope = scopeArr.join('/');
    }

    const newUiSchema = {
      ...values.uiSchema,
      scope: newScope,
      rule: {
        effect: values.uiSchema.rule?.effect,
        condition: {
          key: values.uiSchema.rule?.condition?.key ?? undefined,
          scope: values.uiSchema.rule?.condition?.key
            ? `#${findPath(
                dataSchema,
                'key',
                values.uiSchema.rule?.condition?.key!
              )?.replace('/key', '')}`
            : undefined,
          schema: values.formRules
            ? buildConditionObject(values.formRules)
            : undefined,
        },
      },
    };

    if (newName !== oldName) {
      delete Object.assign(values.dataSchema, {
        [newName]: values.dataSchema[oldName!],
      })[oldName!];
    }

    updateElementSchemas({
      ...elementInstance,
      uiSchema: newUiSchema,
      dataSchema: values.dataSchema,
    });
  }

  return (
    <PropertiesForm elementInstance={elementInstance} update={updateSchemas} />
  );
}
