import {
  DataSchema,
  Rule,
  SchemaPrimitiveType,
  SchemaProperty,
  SchemaPropertyBody,
  UISchema,
} from '@engine/shared-types';
import { Operator } from '../types';

export function getElementDataSchemaByScope(
  scope: string,
  dataSchema: DataSchema
): SchemaPropertyBody | null {
  const path = scope.split('/');
  const first = path.shift();
  if (!first) {
    return dataSchema;
  }
  if (first === '#') {
    return getElementDataSchemaByScope(path.join('/'), dataSchema);
  }
  if (dataSchema.hasOwnProperty(first)) {
    const property = dataSchema[first as keyof DataSchema];
    return getElementDataSchemaByScope(path.join('/'), property as any);
  }
  return null;
}

export function findPath(
  obj: any,
  propertyName: string,
  val: string,
  currentPath?: string
): string | undefined {
  currentPath = currentPath || '';

  let matchingPath;

  if (!obj || typeof obj !== 'object') return;

  if (obj[propertyName] === val) return `${currentPath}`;

  for (const key of Object.keys(obj)) {
    if (key === propertyName && obj[key] === val) {
      matchingPath = currentPath;
    } else {
      matchingPath = findPath(
        obj[key],
        propertyName,
        val,
        currentPath !== '' ? `${currentPath}/${key}` : `${key}`
      );
    }

    if (matchingPath) break;
  }

  return matchingPath;
}


export function removePropertyByPath(obj: any, path: string, isRoot = true) {
  if (path === '') {
    return {}
  }
  if (isRoot) {
    // remove entire root object
    if (obj.hasOwnProperty(path)) {
      return {};
    }
  }
  const p = path.split('/');
  const first = p.shift();
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (i == first) {
      if (p.length === 0) {
        if (Array.isArray(obj)) {
          obj.splice(+first, 1);
        } else {
          delete obj[first];
        }
      } else if (typeof obj[i] == 'object') {
        removePropertyByPath(obj[i], p.join('/'), false);
      }
    }
  }
  return obj;
}

export function addPropertyByPath(
  obj: any,
  parentPath: string,
  element: SchemaProperty | UISchema,
  keyOfElementBefore: string,
  position: 'before' | 'after',
  isRoot = true
) {
  if (isRoot) {
    //  root object
    if (obj.hasOwnProperty(parentPath)) {
      if (Array.isArray(obj)) {
        addElementInPosition(element, keyOfElementBefore, obj, position);
      } else {
        obj[parentPath] = { ...obj[parentPath], ...element };
      }
      return obj;
    }
  }
  const p = parentPath.split('/');
  const first = p.shift();
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (i == first) {
      if (p.length === 0) {
        if (Array.isArray(obj)) {
          addElementInPosition(element, keyOfElementBefore, obj, position);
        } else {
          obj[first] = { ...obj[first], ...element };
        }
      } else if (typeof obj[i] == 'object') {
        addPropertyByPath(
          obj[i],
          p.join('/'),
          element,
          keyOfElementBefore,
          position,
          false
        );
      }
    }
  }
  return obj;
}

export function addElementInPosition(
  element: SchemaProperty | UISchema,
  adjacentElementKey: string,
  parentElement: any[],
  position: 'before' | 'after'
) {
  const pIndex = parentElement.findIndex((x) => x.key === adjacentElementKey);
  if (position === 'before') {
    parentElement.splice(pIndex, 0, element);
  }
  if (position === 'after') {
    parentElement.splice(pIndex + 1, 0, element);
  }
}

export function updateElementProperties(
  obj: any,
  oldPath: string,
  newObj: any
) {
  const p = oldPath.split('/');
  const first = p.shift();
  for (var i in obj) {
    if (i == first) {
      if (p.length === 0) {
        // for uiSchema update
        if (Array.isArray(obj)) {
          obj[+first] = newObj;
        } else {
          // for dataschema update
          // delete Object.assign(obj, { [Object.keys(newObj)[0]]: obj[first] })[
          //   first
          // ];
          delete obj[first];
          obj[Object.keys(newObj)[0]] = Object.values(newObj)[0];
        }
      } else if (typeof obj[i] == 'object') {
        updateElementProperties(obj[i], p.join('/'), newObj);
      }
    }
  }
  return obj;
}

export function buildConditionObject(
  formRules: {
    operator: Operator;
    value: string;
  }[]
) {
  let schema: { [key: string]: any } = {};
  for (const rule of formRules) {
    if (rule.operator === 'ne') {
      if (schema.hasOwnProperty('not')) {
        schema['not']['enum'].push(rule.value);
      } else {
        schema['not'] = { enum: [rule.value] };
      }
    }
    if (rule.operator === 'eq') {
      if (schema.hasOwnProperty('enum')) {
        schema['enum'].push(rule.value);
      } else {
        schema['enum'] = [rule.value];
      }
    }
    if (rule.operator === 'gt') {
      schema['exclusiveMinimum'] = rule.value;
    }
    if (rule.operator === 'gte') {
      schema['minimum'] = rule.value;
    }
    if (rule.operator === 'lt') {
      schema['exclusiveMaximum'] = rule.value;
    }
    if (rule.operator === 'lte') {
      schema['maximum'] = rule.value;
    }
    if (rule.operator === 'contains') {
      schema['contains'] = { enum: [rule.value] };
    }
  }
  return schema;
}

export function evaluateRule(
  value: number | string | string[] | number[],
  rule: Rule
) {
  if (typeof value === 'string' || typeof value === 'number') {
    if (rule.condition?.schema?.hasOwnProperty('enum')) {
      if (
        rule.condition?.schema?.enum?.includes(
          value.toString() as SchemaPrimitiveType
        )
      ) {
        return true;
      }
    }
  }
}
