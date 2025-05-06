import { REACT_TEXT } from "./constants";

export function isText(element) {
  if (typeof element === "string" || typeof element === "number") {
    return true;
  }

  return false;
}

export function isUndefined(val) {
  return val === undefined || val === null;
}

export function isDefined(val) {
  return val !== undefined && val !== null;
}

export function wrapToArray(val) {
  return Array.isArray(val) ? val.flat() : [val];
}

export function wrapToVdom(element) {
  return isText(element) ? { $$typeof: REACT_TEXT, props: element } : element;
}
