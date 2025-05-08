import { setBatchingUpdate, flushDirtyComponents } from "../react";

const eventTypeMethods = {
  click: {
    capture: "onClickCapture",
    bubble: "onClick",
  },
};

const phases = ["capture", "bubble"];

function createSyntheticEvent(nativeEvent) {
  let isDefaultPrevented = false;
  let isPropagationStoped = false;
  const target = {
    nativeEvent,
    preventDefault() {
      if (nativeEvent.preventDefault) {
        nativeEvent.preventDefault();
      } else {
        nativeEvent.returnValue = false;
      }

      isDefaultPrevented = true;
    },
    stopPropagation() {
      if (nativeEvent.stopPropagation) {
        nativeEvent.stopPropagation();
      } else {
        nativeEvent.cancelBubble = true;
      }

      isPropagationStoped = true;
    },
    isDefaultPrevented() {
      return isDefaultPrevented;
    },
    isPropagationStoped() {
      return isPropagationStoped;
    },
  };

  const handler = {
    get(target, key) {
      if (target.hasOwnProperty(key)) {
        return Reflect.get(target, key);
      } else {
        const value = Reflect.get(nativeEvent, key);

        // why need to make sure this point to native event?
        return typeof value === "function" ? value.bind(nativeEvent) : value;
      }
    },
  };

  return new Proxy(target, handler);
}

/**
 * set event delegation
 * @param {*} container
 */
export function setEventDelegation(container) {
  Reflect.ownKeys(eventTypeMethods).forEach((eventType) => {
    phases.forEach((phase) => {
      container.addEventListener(
        eventType,
        (nativeEvent) => {
          const syntheticEvent = createSyntheticEvent(nativeEvent);
          const paths = syntheticEvent.composedPath();
          const elements = phase === "capture" ? paths.reverse() : paths;
          const methodName = eventTypeMethods[eventType]?.[phase];
          // in react event, the batch update is true
          setBatchingUpdate(true);

          for (let element of elements) {
            if (syntheticEvent.isPropagationStoped()) {
              break;
            }
            syntheticEvent.currentTarget = element;

            if (element.reactEvents?.[methodName]) {
              element.reactEvents?.[methodName]?.(syntheticEvent);
            }
          }

          // batch update dirty component and init the isBatchingUpdate
          setBatchingUpdate(false);
          flushDirtyComponents();
        },
        phase === "capture"
      );
    });
  });
}
