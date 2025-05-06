// the sample of virtual dom
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  type: "div",
  props: {
    style: {
      color: "red",
    },
    clasName: "container",
    children: [
      "hello",
      {
        type: "span",
        props: {
          style: {
            color: "blue",
          },
          children: "world",
        },
      },
    ],
  },
};
