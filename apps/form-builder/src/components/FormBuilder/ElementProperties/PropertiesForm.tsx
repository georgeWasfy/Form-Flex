import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Switch,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
  Button,
} from '@engine/design-system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ElementsType, FormElementInstance, RuleEffects } from '../types';
import useDesigner from '../Hooks/useDesigner';
import { useState } from 'react';

const PropertiesForm = ({
  elementInstance,
  update,
}: {
  elementInstance: FormElementInstance;
  update: SubmitHandler<any>;
}) => {
  const generateMinMaxFields = (
    label: { max: string; min: string },
    dataSchemaProperty: { max: string; min: string }
  ) => {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <Label className="mb-2">{label.min}</Label>
          <Controller
            name={`dataSchema[${elementName}].${dataSchemaProperty.min}`}
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                  onChange={(e) =>
                    form.setValue(
                      `dataSchema[${elementName}].${dataSchemaProperty.min}`,
                      parseInt(e.target.value)
                    )
                  }
                  value={parseInt(field.value)}
                  placeholder="Min"
                  className="w-3/4"
                  type="number"
                />
                {fieldState.error?.message && (
                  <Label variant={'error'}>{fieldState.error?.message}</Label>
                )}
              </>
            )}
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Label className="mb-2">{label.max}</Label>
          <Controller
            name={`dataSchema[${elementName}].${dataSchemaProperty.max}`}
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                  onChange={(e) =>
                    form.setValue(
                      `dataSchema[${elementName}].${dataSchemaProperty.max}`,
                      parseInt(e.target.value)
                    )
                  }
                  value={parseInt(field.value)}
                  placeholder="Max"
                  className="w-3/4"
                  type="number"
                />
                {fieldState.error?.message && (
                  <Label variant={'error'}>{fieldState.error?.message}</Label>
                )}
              </>
            )}
          />
        </div>
      </>
    );
  };
  const getMinMaxFields = (type: ElementsType) => {
    return {
      TextField: generateMinMaxFields(
        { max: 'Max Length', min: 'Min Length' },
        { max: 'maxLength', min: 'minLength' }
      ),
      HorizontalLayout: undefined,
      VerticalLayout: undefined,
      GroupAccordionLayout: undefined,
      MultistepLayout: undefined,
      StepLayout: undefined,
      NumberField: generateMinMaxFields(
        { max: 'Max Value', min: 'Min Value' },
        { max: 'maximum', min: 'minimum' }
      ),
      MultiSelectField: undefined,
      SelectField: undefined,
      TextAreaField: generateMinMaxFields(
        { max: 'Max Length', min: 'Min Length' },
        { max: 'maxLength', min: 'minLength' }
      ),
      DateRangeField: undefined,
      DateField: undefined,
    }[type];
  };
  const { elementsMap } = useDesigner();
  const [elementName, setElementName] = useState(elementInstance.uiSchema.name);
  const form = useForm<any>({
    defaultValues: {
      dataSchema: elementInstance.dataSchema,
      uiSchema: elementInstance.uiSchema,
      formRules: [],
    },
  });
  //   onSubmit={form.handleSubmit(update)}
  return (
    <form onBlur={form.handleSubmit(update)} className="space-y-3">
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-decoration-line: underline">
            Properties
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between mb-4">
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
                      className="w-3/4"
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
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
                      className="w-3/4"
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <Label className="mb-2">Description</Label>
              <Controller
                name={`dataSchema[${elementName}].description`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Description"
                      className="w-3/4"
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
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
                      className="w-3/4"
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-decoration-line: underline">
            Data
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between mb-4">
              <Label className="mb-2">Defualt value</Label>
              <Controller
                name={`dataSchema[${elementName}].default`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                      value={field.value}
                      placeholder="Default Value"
                      className="w-3/4"
                      type={
                        elementInstance.dataSchema
                          ? elementInstance.dataSchema[elementName].input
                          : 'text'
                      }
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-decoration-line: underline">
            Decorators
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between mb-4">
              <Label className="mb-2">Prefix</Label>
              <Controller
                name={`dataSchema[${elementName}].prefix`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                      value={field.value}
                      placeholder="Prefix"
                      className="w-3/4"
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <Label className="mb-2">Suffix</Label>
              <Controller
                name={`dataSchema[${elementName}].suffix`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                      value={field.value}
                      placeholder="Suffix"
                      className="w-3/4"
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-decoration-line: underline">
            Validation
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between rounded-lg border mb-4">
              <Label className="mb-2">Required</Label>
              <Controller
                name={`uiSchema.required`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Switch
                      className="bg-gray-850"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
            {getMinMaxFields(elementInstance.subtype)}
            <div className="flex items-center justify-between mb-4">
              <Label className="mb-2">Regex</Label>
              <Controller
                name={`dataSchema[${elementName}].pattern`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                      value={field.value}
                      placeholder="eg. /^.+$/i"
                      className="w-3/4"
                    />
                    {fieldState.error?.message && (
                      <Label variant={'error'}>
                        {fieldState.error?.message}
                      </Label>
                    )}
                  </>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-decoration-line: underline">
            Condition
          </AccordionTrigger>
          <AccordionContent>
            <div className="border border-gray-300 flex items-center justify-between p-2">
              <p>The element has no condition</p>

              <Button
                variant={'default'}
                className="bg-primary-500 hover:bg-primary-600"
              >
                edit
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <div className="flex flex-col">
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
                    <SelectItem
                      className="hover:bg-gray-300"
                      key={effect}
                      value={`${effect}`}
                    >
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
                    <SelectItem
                      className="hover:bg-gray-300"
                      key={elementKey}
                      value={`${elementKey}`}
                    >
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
      </div> */}
      {/* <RulesForm form={form} /> */}
    </form>
  );
};

export default PropertiesForm;
