import { createContext, ReactNode, useState } from 'react';
import { FormElementInstance } from '../types';
import {
  ControlEffect,
  DataSchema,
  Rule,
  SchemaPrimitiveType,
  UISchema,
} from '@engine/shared-types';
import { UISchemaBuilder } from '../SchemaBuilder/UISchemaBuilder';
import { DataSchemaBuilder } from '../SchemaBuilder/DataSchemaBuilder';

type DesignerContextType = {
  dataSchema: DataSchema;
  uiSchema?: UISchema;
  elementsMap: Map<string, string>;
  addElementSchemas: (element: FormElementInstance) => void;
  removeElement: (key: string) => void;
  removeLayout: (key: string) => void;
  addElementInPosition: (
    element: FormElementInstance,
    keyOfElementBefore: string,
    position: 'before' | 'after'
  ) => void;
  addElementInLayout: (element: FormElementInstance, layoutKey: string) => void;
  selectedElement: FormElementInstance | null;
  setSelectedElement: React.Dispatch<
    React.SetStateAction<FormElementInstance | null>
  >;
  updateElementSchemas: (element: FormElementInstance) => void;
  elementsToWatch: Map<
    string,
    {
      rule: Rule;
      dependableElementName: string;
    }
  >;
  uiElementsState: Map<string, ControlEffect>;
  addSteps: (element: FormElementInstance, steps: any[]) => void;
  setActiveStep: (step: number, element: FormElementInstance) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const baseDataSchema = {
    $schema: '',
    title: 'Form',
    description: 'New Form DataSchema',
    type: 'object' as SchemaPrimitiveType,
    properties: {},
    required: [],
  };
  const [dataSchema, setDataSchema] = useState<DataSchema>(baseDataSchema);
  const [uiSchema, setUISchema] = useState<UISchema | undefined>();
  // maps element key => element name
  const [elementsMap, setElementsMap] = useState<Map<string, string>>(
    new Map()
  );
  const elementsToWatch: Map<
    string,
    {
      rule: Rule;
      dependableElementName: string;
    }
  > = new Map();
  const uiElementsState: Map<string, ControlEffect> = new Map();
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const removeElement = (key: string) => {
    setElementsMap((prev) => {
      prev?.delete(key);
      return new Map(prev);
    });
    const updatedDataSchema = new DataSchemaBuilder()
      .from(dataSchema)
      .removeElement(key)
      .getSchema();

    const updatedUISchema = new UISchemaBuilder()
      .from(uiSchema)
      .removeElement(key)
      .getSchema();

    setDataSchema(updatedDataSchema);
    setUISchema(updatedUISchema);
  };

  const removeLayout = (key: string) => {
    setElementsMap((prev) => {
      prev?.delete(key);
      return new Map(prev);
    });
    const updatedUISchema = new UISchemaBuilder()
      .from(uiSchema)
      .removeElement(key)
      .getSchema();

    setUISchema(updatedUISchema);
  };
  const addElementSchemas = (element: FormElementInstance) => {
    if (uiSchema === undefined && element.type === 'Input') {
      alert('You Cant add an input outside of a layout ');
      return;
    }
    if (uiSchema === undefined) {
      setUISchema(element.uiSchema);
    }
    if (uiSchema !== undefined && Object.keys(uiSchema).length) {
      setUISchema((prev) => {
        if (prev)
          return {
            ...prev,
            elements: prev?.elements
              ? [...prev.elements, element.uiSchema]
              : [element.uiSchema],
          };
      });
    }
    if (element.type === 'Input') {
      setElementsMap(
        new Map(elementsMap.set(element.key, element.uiSchema.name))
      );
      if (element.dataSchema) {
        setDataSchema((prev) => {
          return {
            ...prev,
            properties: {
              ...prev.properties,
              ...element.dataSchema!,
            },
          };
        });
      }
    }
  };
  const addElementInPosition = (
    element: FormElementInstance,
    keyOfElementBefore: string,
    position: 'before' | 'after'
  ) => {
    const newUiSchema = new UISchemaBuilder()
      .from(uiSchema)
      .addElement(element.uiSchema, keyOfElementBefore, position)
      .getSchema();

    setUISchema(newUiSchema);

    if (element.dataSchema) {
      const newDataSchema = new DataSchemaBuilder()
        .from(dataSchema)
        .addElement(element.dataSchema, keyOfElementBefore, position)
        .getSchema();

      setDataSchema(newDataSchema);
    }
    if (element.type === 'Input') {
      setElementsMap(
        new Map(elementsMap.set(element.key, element.uiSchema.name))
      );
    }
  };

  const addElementInLayout = (
    element: FormElementInstance,
    layoutKey: string
  ) => {
    const uiBuilder = new UISchemaBuilder().from(uiSchema);
    const parentLayout = uiBuilder.getElement(layoutKey);
    if (
      parentLayout?.type === 'MultistepLayout' &&
      parentLayout.elements?.length
    ) {
      const activeStep = parentLayout.activeStep || 1;
      layoutKey = parentLayout.elements[activeStep - 1].key;
    }
    const newUISchema = uiBuilder
      .appendElement(layoutKey, element.uiSchema)
      .getSchema();

    setUISchema(newUISchema);
    if (element.type === 'Input') {
      setElementsMap(
        new Map(elementsMap.set(element.key, element.uiSchema.name))
      );
      if (element.dataSchema) {
        setDataSchema((prev) => {
          return {
            ...prev,
            properties: {
              ...prev.properties,
              ...element.dataSchema!,
            },
          };
        });
      }
    }
  };

  const updateElementSchemas = (element: FormElementInstance) => {
    const newUISchema = new UISchemaBuilder()
      .from(uiSchema)
      .updateElement(element.key, element.uiSchema)
      .getSchema();

    setUISchema(newUISchema);
    setSelectedElement(element);

    if (element.type === 'Input') {
      const localSchema = Object.assign({}, dataSchema);
      if (element.uiSchema.required) {
        localSchema.required?.splice(
          localSchema.required.indexOf(element.uiSchema.name),
          1
        );
        localSchema.required?.push(element.uiSchema.name);
      } else {
        localSchema.required?.splice(
          localSchema.required.indexOf(element.uiSchema.name),
          1
        );
      }
      const newDataSchema = new DataSchemaBuilder()
        .from(localSchema)
        .updateElement(element.key, element.dataSchema!)
        .getSchema();
      setDataSchema(newDataSchema);

      setElementsMap(
        new Map(elementsMap.set(element.key, element.uiSchema.name))
      );
    }
  };
  const addSteps = (element: FormElementInstance, steps: any[]) => {
    setUISchema({ ...element.uiSchema, elements: steps });
  };
  const setActiveStep = (step: number, element: FormElementInstance) => {
    const newUiSchema = {
      ...element.uiSchema,
      activeStep: step + 1,
    };
    setUISchema(newUiSchema);
  };
  return (
    <DesignerContext.Provider
      value={{
        dataSchema,
        uiSchema,
        addElementInLayout,
        addElementSchemas,
        addElementInPosition,
        removeElement,
        removeLayout,
        selectedElement,
        setSelectedElement,
        updateElementSchemas,
        elementsMap,
        elementsToWatch,
        uiElementsState,
        addSteps,
        setActiveStep,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
