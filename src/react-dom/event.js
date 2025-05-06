const eventTypeMethods = {
  click: {
    capture: "onClickCapture",
    bubble: "onClick",
  },
};

const phases = ["capture", "bubble"];

/**
 * set event delegation
 * @param {*} container
 */
export function setEventDelegation(container) {
  Reflect.ownKeys(eventTypeMethods).forEach((eventType) => {
    phases.forEach((phase) => {
      container.addEventListener(eventType, (nativeEvent) => {
        const paths = nativeEvent.composedPath();
        console.log("path ===>", paths);
        const elements = phase === "capture" ? paths.reverse() : paths;
        for (let element of elements) {
          const methodName = eventTypeMethods[eventType]?.[phase];
          element.reactEvents?.[methodName]?.(nativeEvent);
        }
      });
    });
  });
}
