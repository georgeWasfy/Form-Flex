import {
  DataSchema,
  SchemaPrimitiveType,
  SchemaProperty,
} from '@engine/shared-types';
import {
  addPropertyByPath,
  findPath,
  removePropertyByPath,
  updateElementProperties,
} from './helpers';

export class DataSchemaBuilder {
  private DataSchema: DataSchema = {
    $schema: '',
    title: 'Form',
    description: 'New Form DataSchema',
    type: 'object' as SchemaPrimitiveType,
    properties: {},
  };
  from(DataSchema: DataSchema) {
    if (DataSchema) {
      this.DataSchema = DataSchema;
    }
    return this;
  }

  removeElement(key: string) {
    const elementPath = findPath(this.DataSchema, 'key', key);
    if (typeof elementPath === 'string') {
      const newSchema = removePropertyByPath(this.DataSchema, elementPath);
      this.DataSchema = Object.keys(newSchema).length ? newSchema : undefined;
      return this;
    }
    return this;
  }
  addElement(
    element: SchemaProperty,
    keyOfSiblingElement: string,
    position: 'before' | 'after'
  ) {
    const elementPath = findPath(
      this.DataSchema,
      'key',
      keyOfSiblingElement
    )?.replace(`/${keyOfSiblingElement}`, '');
    if (typeof elementPath === 'string') {
      const newSchema = addPropertyByPath(
        this.DataSchema,
        elementPath,
        element,
        keyOfSiblingElement,
        position
      );
      this.DataSchema = newSchema;
      return this;
    }
    return this;
  }
  updateElement(key: string, dataSchema: SchemaProperty) {
    const elementPath = findPath(this.DataSchema, 'key', key);
    if (typeof elementPath === 'string') {
      const newSchema = updateElementProperties(
        this.DataSchema,
        elementPath,
        dataSchema
      );
      this.DataSchema = Object.keys(newSchema).length ? newSchema : undefined;
      return this;
    }
    return this;
  }
  //////////////GETTERS//////////////

  getSchema() {
    return this.DataSchema;
  }
}
