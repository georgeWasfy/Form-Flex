import { ajvResolver } from '@hookform/resolvers/ajv';
import { JSONSchemaType } from 'ajv';
import { ReactNode, createContext } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import useDesigner from '../Hooks/useDesigner';
import { SchemaProperty } from '@engine/shared-types';

type FormContext = {
  form: UseFormReturn;
};
export const FormContext = createContext<FormContext | null>(null);

export default function FormContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { dataSchema } = useDesigner();
  const getDefaults = (properties: SchemaProperty) => {
    const defaults: { [key: string]: any } = {};
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        const element = properties[key];
        defaults[key] = element.default;
      }
    }
    return defaults;
  };
  const form = useForm({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      console.log('formData', data);
      console.log(
        'validation result',
        await ajvResolver(dataSchema as any, { strict: false })(
          data,
          context,
          options
        )
      );
      return await ajvResolver(dataSchema as JSONSchemaType<any>, {
        strict: false,
      })(data, context, options);
    },
    mode: 'all',
    defaultValues: getDefaults(dataSchema.properties),
  });
  return (
    <FormContext.Provider value={{ form }}>{children}</FormContext.Provider>
  );
}
