import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@engine/design-system';
import { UISchema, SchemaProperty, ControlEffect } from '@engine/shared-types';
import { TextAlignMiddleIcon } from '@radix-ui/react-icons';
import {
  Controller,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import RulesForm from '../Designer/SidebarRulesForm';
import { findPath, buildConditionObject } from '../SchemaBuilder/helpers';
import useDesigner from '../Hooks/useDesigner';
import {
  FormElement,
  FormElementInstance,
  Operator,
  RuleEffects,
} from '../types';
import useCustomeForm from '../Hooks/useForm';

export const TextAreaFieldFormElement: FormElement = {
  type: 'TextAreaField',
  construct: (key: string) => ({
    key,
    type: 'Input',
    subtype: 'TextAreaField',
    dataSchema: {
      [key]: {
        key,
        type: 'string',
        pattern: '',
        description: 'This is Element Description',
        errorMessage: { type: 'foo must be an Integer' },
      },
    },
    uiSchema: {
      key,
      type: 'Control',
      required: true,
      name: key,
      label: '',
      rows: 1,
      variant: 'TextArea',
      placeholder: 'Input Placeholder',
      scope: `#/properties/${key}`,
    },
  }),
  designerBtnElement: {
    icon: TextAlignMiddleIcon,
    label: 'TextArea  field',
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
      <Textarea
        readOnly
        disabled
        placeholder={elementInstance.uiSchema.placeholder}
        rows={elementInstance.uiSchema.rows}
        className='bg-gray-600'

      />
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
            <Textarea
              placeholder={elementInstance.uiSchema.placeholder}
              rows={elementInstance.uiSchema.rows}
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
  const { updateElementSchemas, elementsMap, dataSchema } = useDesigner();
  const form = useForm<any>({
    defaultValues: {
      dataSchema: elementInstance.dataSchema,
      uiSchema: elementInstance.uiSchema,
      formRules: [],
    },
  });
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
    <form onSubmit={form.handleSubmit(updateSchemas)} className="space-y-3">
      <div className="flex flex-col">
        <Label className="mb-2">Label</Label>
        <Controller
          name={`uiSchema.label`}
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

      <div className="flex flex-col">
        <Label className="mb-2">name</Label>
        <Controller
          name="uiSchema.name"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                value={field.value}
                placeholder="Name"
                className="w-full"
              />
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col">
        <Label className="mb-2">Description</Label>
        <Controller
          name={`dataSchema[${elementInstance.uiSchema.name}].description`}
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                value={field.value}
                placeholder="Description"
                className="w-full"
              />
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>
      <div className="flex flex-col">
        <Label className="mb-2">placeholder</Label>
        <Controller
          name={`uiSchema.placeholder`}
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                value={field.value}
                placeholder="Placeholder"
                className="w-full"
              />
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>
      <div className="flex flex-col">
        <Label className="mb-2">Height</Label>
        <Controller
          name={`uiSchema.rows`}
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                value={field.value}
                type={'number'}
                placeholder="Placeholder"
                className="w-full"
              />
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label className="mb-2">Required</Label>
        <Controller
          name={`uiSchema.required`}
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Switch
                className="bg-white"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>
      <div className="flex flex-col">
        <Label className="mb-2">Rule Effect</Label>
        <Controller
          name={`uiSchema.rule.effect`}
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="h-8 w-full bg-white">
                  <SelectValue placeholder={'select effect'} />
                </SelectTrigger>
                <SelectContent className="bg-white" side="top">
                  {RuleEffects.map((effect) => (
                    <SelectItem key={effect} value={`${effect}`}>
                      {effect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>
      <div className="flex flex-col">
        <Label className="mb-2">Rule Element</Label>
        <Controller
          name={`uiSchema.rule.condition.key`}
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-full bg-white">
                  <SelectValue placeholder={'select element'} />
                </SelectTrigger>
                <SelectContent className="bg-white" side="top">
                  {Array.from(elementsMap.keys()).map((elementKey) => (
                    <SelectItem key={elementKey} value={`${elementKey}`}>
                      {elementsMap.get(elementKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error?.message && (
                <Label variant={'error'}>{fieldState.error?.message}</Label>
              )}
            </>
          )}
        />
      </div>
      <RulesForm form={form} />
    </form>
  );
}
