import { Input, Label } from '@engine/design-system';
import { UISchema, SchemaProperty, ControlEffect } from '@engine/shared-types';
import { TextIcon } from '@radix-ui/react-icons';
import { Controller } from 'react-hook-form';
import RulesForm from '../Designer/SidebarRulesForm';
import { buildConditionObject, findPath } from '../SchemaBuilder/helpers';
import useDesigner from '../Hooks/useDesigner';
import { FormElement, FormElementInstance, Operator } from '../types';
import useCustomeForm from '../Hooks/useForm';
import PropertiesForm from '../ElementProperties/PropertiesForm';

export const TextFieldFormElement: FormElement = {
  type: 'TextField',
  construct: (key: string) => ({
    key,
    type: 'Input',
    subtype: 'TextField',
    dataSchema: {
      [key]: {
        key,
        type: 'string',
        input: 'text',
        pattern: '',
        default: '',
        prefix: '',
        suffix: '',
        description: 'This is Element Description',
        maxLength: 255,
        minLength: 1,
        errorMessage: {
          type: 'Custom: Must have characters',
          minLength: 'Custom: This field is required',
          maxLength: 'Custom: This field is has max of 255 characters',
          pattern: 'Custom: The field does not comply with specified pattern ',
        },
      },
    },
    uiSchema: {
      key,
      type: 'Control',
      required: false,
      name: key,
      variant: 'Text',
      label: '',
      placeholder: 'Input Placeholder',
      scope: `#/properties/${key}`,
    },
  }),
  designerBtnElement: {
    icon: TextIcon,
    label: 'Text  Field',
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
      <span className='flex items-center'>
        {elementInstance.dataSchema &&
          elementInstance.dataSchema[elementName].prefix}
        <Input
          readOnly
          disabled
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
              placeholder={elementInstance.uiSchema.placeholder}
              defaultValue={''}
              {...field}
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
  const { updateElementSchemas, dataSchema } = useDesigner();

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
