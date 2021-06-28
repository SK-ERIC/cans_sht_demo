import { Dictionary, GradientObject, ImagePatternObject } from '@src/types/common';

// 用于处理merge时无法遍历Date等对象的问题
const BUILTIN_OBJECT: { [key: string]: boolean } = {
  '[object Function]': true,
  '[object RegExp]': true,
  '[object Date]': true,
  '[object Error]': true,
  '[object CanvasGradient]': true,
  '[object CanvasPattern]': true,
  // For node-canvas
  '[object Image]': true,
  '[object Canvas]': true
};

const TYPED_ARRAY: { [key: string]: boolean } = {
  '[object Int8Array]': true,
  '[object Uint8Array]': true,
  '[object Uint8ClampedArray]': true,
  '[object Int16Array]': true,
  '[object Uint16Array]': true,
  '[object Int32Array]': true,
  '[object Uint32Array]': true,
  '[object Float32Array]': true,
  '[object Float64Array]': true
};

const objToString = Object.prototype.toString;

const arrayProto = Array.prototype;
const nativeForEach = arrayProto.forEach;
const nativeFilter = arrayProto.filter;
const nativeSlice = arrayProto.slice;
const nativeMap = arrayProto.map;
// In case some env may redefine the global variable `Function`.
const ctorFunction = function () {}.constructor;
const protoFunction = ctorFunction ? ctorFunction.prototype : null;

// Avoid assign to an exported constiable, for transforming to cjs.
const methods: { [key: string]: Function } = {};
/**
 * @param str string to be trimed
 * @return trimed string
 */
export function trim(str: string): string {
  if (str == null) {
    return '';
  } else if (typeof str.trim === 'function') {
    return str.trim();
  } else {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  }
}

const primitiveKey = '__ec_primitive__';
/**
 * Set an object as primitive to be ignored traversing children in clone or merge
 */
export function setAsPrimitive(obj: any) {
  obj[primitiveKey] = true;
}

export function isPrimitive(obj: any): boolean {
  return obj[primitiveKey];
}

export function simpleEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  } else if (typeof obj1 !== typeof obj2 || typeof obj1 !== 'object') {
    return false;
  } else {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    } else {
      for (const key of keys1) {
        if (!simpleEqual(obj1[key], obj2[key])) {
          return false;
        }
      }
      return true;
    }
  }
}

export function pickEqual<T, P extends T, K extends keyof T>(
  obj1: T,
  obj2: P,
  props: K[]
): boolean {
  for (let i = 0, k = props.length; i < k; i++) {
    const key = props[i];
    if (!simpleEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

export function pick<T extends { [key: string]: any }, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((prev, cur) => {
    prev[cur] = obj[cur];
    return prev;
  }, {} as any);
}

/**
 * Those data types can be cloned:
 *     Plain object, Array, TypedArray, number, string, null, undefined.
 * Those data types will be assgined using the orginal data:
 *     BUILTIN_OBJECT
 * Instance of user defined class will be cloned to a plain object, without
 * properties in prototype.
 * Other data types is not supported (not sure what will happen).
 *
 * Caution: do not support clone Date, for performance consideration.
 * (There might be a large number of date in `series.data`).
 * So date should not be modified in and out of echarts.
 */
export function clone<T extends any>(source: T): T {
  if (source == null || typeof source !== 'object') {
    return source;
  }

  let result = source as any;
  const typeStr = <string>objToString.call(source);

  if (typeStr === '[object Array]') {
    if (!isPrimitive(source)) {
      result = [] as any;
      for (let i = 0, len = (source as any[]).length; i < len; i++) {
        result[i] = clone((source as any[])[i]);
      }
    }
  } else if (TYPED_ARRAY[typeStr]) {
    if (!isPrimitive(source)) {
      // @ts-ignore
      const Ctor = source.constructor as typeof Float32Array;
      if (Ctor.from) {
        result = Ctor.from(source as Float32Array);
      } else {
        result = new Ctor((source as Float32Array).length);
        for (let i = 0, len = (source as Float32Array).length; i < len; i++) {
          result[i] = clone((source as Float32Array)[i]);
        }
      }
    }
  } else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
    result = {} as any;
    for (let key in source) {
      // @ts-ignore
      if (source.hasOwnProperty(key)) {
        result[key] = clone(source[key]);
      }
    }
  }

  return result;
}

export function merge<T extends Dictionary<any>, S extends Dictionary<any>>(
  target: T,
  source: S,
  overwrite?: boolean
): T & S;
export function merge<T extends any, S extends any>(
  target: T,
  source: S,
  overwrite?: boolean
): T | S;
export function merge(target: any, source: any, overwrite?: boolean): any {
  // We should escapse that source is string
  // and enter for ... in ...
  if (!isObject(source) || !isObject(target)) {
    return overwrite ? clone(source) : target;
  }

  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      const targetProp = target[key];
      const sourceProp = source[key];

      if (
        isObject(sourceProp) &&
        isObject(targetProp) &&
        !isArray(sourceProp) &&
        !isArray(targetProp) &&
        !isDom(sourceProp) &&
        !isDom(targetProp) &&
        !isBuiltInObject(sourceProp) &&
        !isBuiltInObject(targetProp) &&
        !isPrimitive(sourceProp) &&
        !isPrimitive(targetProp)
      ) {
        // 如果需要递归覆盖，就递归调用merge
        merge(targetProp, sourceProp, overwrite);
      } else if (overwrite || !(key in target)) {
        // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
        // NOTE，在 target[key] 不存在的时候也是直接覆盖
        target[key] = clone(source[key]);
      }
    }
  }

  return target;
}

function equals(obj1: any, obj2: any) {
  const keys = Object.keys(obj1);
  if (keys.length !== Object.keys(obj2).length) return false;
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v1 = obj1[k];
    const v2 = obj2[k];
    if (v2 === undefined) return false;
    if (typeof v1 === 'string' || typeof v1 === 'number' || typeof v1 === 'boolean') {
      if (v1 !== v2) return false;
    } else if (Array.isArray(v1)) {
      if (v1.length !== v2.length) return false;
      for (let ai = 0; ai < v1.length; ai += 1) {
        if (!equals(v1[ai], v2[ai])) return false;
      }
    } else if (typeof v1 !== 'function' && !Array.isArray(v1) && v1 instanceof Object) {
      if (!equals(v1, v2)) return false;
    }
  }
  return true;
}

export function isArray(value: any): value is any[] {
  if (Array.isArray) {
    return Array.isArray(value);
  }
  return objToString.call(value) === '[object Array]';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  // Faster than `objToString.call` several times in chromium and webkit.
  // And `new String()` is rarely used.
  return typeof value === 'string';
}

export function isStringSafe(value: any): value is string {
  return objToString.call(value) === '[object String]';
}

export function isNumber(value: any): value is number {
  // Faster than `objToString.call` several times in chromium and webkit.
  // And `new Number()` is rarely used.
  return typeof value === 'number';
}

// Usage: `isObject(xxx)` or `isObject(SomeType)(xxx)`
// Generic T can be used to avoid "ts type gruards" casting the `value` from its original
// type `Object` implicitly so that loose its original type info in the subsequent code.
export function isObject<T = unknown>(value: T): value is object & T {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  const type = typeof value;
  return type === 'function' || (!!value && type === 'object');
}

export function isBuiltInObject(value: any): boolean {
  return !!BUILTIN_OBJECT[objToString.call(value)];
}

export function isTypedArray(value: any): boolean {
  return !!TYPED_ARRAY[objToString.call(value)];
}

export function isDom(value: any): value is HTMLElement {
  return (
    typeof value === 'object' &&
    typeof value.nodeType === 'number' &&
    typeof value.ownerDocument === 'object'
  );
}

export function isGradientObject(value: any): value is GradientObject {
  return (value as GradientObject).colorStops != null;
}

export function isImagePatternObject(value: any): value is ImagePatternObject {
  return (value as ImagePatternObject).image != null;
}

export function isRegExp(value: unknown): value is RegExp {
  return objToString.call(value) === '[object RegExp]';
}
