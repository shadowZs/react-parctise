// cash the funcs with nested function
function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg;

  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

// reduceRight
function compose1(...funcs) {
  const len = funcs.length;
  if (len === 0) return (arg) => arg;
  if (len === 1) return funcs[0];
  const firstFunc = funcs.pop();
  return function (...args) {
    return funcs.reduceRight(
      (result, func) => func(result),
      firstFunc(...args)
    );
  };
}

// for each

function compose2(...funcs) {
  const len = funcs.length;
  if (len === 0) return (arg) => arg;
  return function (args) {
    let result = args;
    for (let i = len - 1; i >= 0; i--) {
      result = funcs[i](result);
    }
    return result;
  };
}

function add(a) {
  return a + 2;
}

function reduce(a) {
  return a - 1;
}

function multiply(a) {
  return a * 2;
}

const result = compose(add, reduce, multiply)(3);
const result1 = compose1(add, reduce, multiply)(3);
const result2 = compose2(add, reduce, multiply)(3);
console.log("result ==>", result, result1, result2);
