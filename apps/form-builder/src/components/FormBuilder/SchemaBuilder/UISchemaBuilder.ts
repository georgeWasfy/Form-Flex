import { UISchema } from '@engine/shared-types';
import { addPropertyByPath, findPath, removePropertyByPath, updateElementProperties } from './helpers';
import { FormElementInstance } from '../types';

export class UISchemaBuilder {
  private UiSchema: UISchema | undefined;
  constructor() {}
  from(uiSchema: UISchema | undefined) {
    if (uiSchema) {
      this.UiSchema = uiSchema;
    }
    return this;
  }
  appendElement(parentKey: string, elementUiSchema: UISchema) {
    if (!parentKey || !this.UiSchema) return this;
    const newUiSchema = this.addElementToParent(
      parentKey,
      this.UiSchema,
      elementUiSchema
    );
    this.UiSchema = newUiSchema;
    return this;
  }

  removeElement(key: string) {
    const elementPath = findPath(this.UiSchema, 'key', key);
    if (typeof elementPath === 'string') {
      const newSchema = removePropertyByPath(this.UiSchema, elementPath);
      this.UiSchema = Object.keys(newSchema).length ? newSchema : undefined;
      return this;
    }
    return this;
  }
  addElement(
    element: UISchema,
    keyOfSiblingElement: string,
    position: 'before' | 'after'
  ) {
    const elementPath = findPath(this.UiSchema, 'key', keyOfSiblingElement);
    if (typeof elementPath === 'string') {
      const newSchema = addPropertyByPath(
        this.UiSchema,
        elementPath,
        element,
        keyOfSiblingElement,
        position
      );
      this.UiSchema = newSchema;
      return this;
    }
    return this;
  }
  updateElement(key: string, uiSchema: UISchema) {
    const elementPath = findPath(this.UiSchema, 'key', key);
    if (typeof elementPath === 'string') {
      const newSchema = updateElementProperties(this.UiSchema, elementPath, uiSchema);
      this.UiSchema = Object.keys(newSchema).length ? newSchema : undefined;
      return this;
    }
    return this;
  }
  //////////////GETTERS//////////////
  getElement(elementKey: string): Partial<UISchema> | null {
    if (!elementKey || !this.UiSchema) return null;
    return this.getElementByKey(elementKey, this.UiSchema);
  }

  getSchema() {
    return this.UiSchema;
  }

  //////////////PRIVATE HELPERS////////////
  private addElementToParent(
    layoutKey: string,
    formUiSchema: UISchema,
    elementUiSchema: UISchema
  ) {
    if (
      formUiSchema.hasOwnProperty('key') &&
      formUiSchema['key'] === layoutKey
    ) {
      formUiSchema.elements?.push(elementUiSchema);
      return formUiSchema;
    }
    if (formUiSchema.elements && formUiSchema.elements?.length) {
      for (const element of formUiSchema.elements) {
        this.addElementToParent(layoutKey, element, elementUiSchema);
      }
    }
    return formUiSchema;
  }

  private getElementByKey(
    key: string,
    uiSchema: UISchema
  ): Partial<UISchema> | null {
    if (!key) return null;

    if (uiSchema.hasOwnProperty('key') && uiSchema['key'] === key) {
      return uiSchema;
    }
    if (uiSchema.elements && uiSchema.elements?.length) {
      for (const element of uiSchema.elements) {
        return this.getElementByKey(key, element);
      }
    }
    return null;
  }
}
