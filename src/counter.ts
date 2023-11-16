import { useMutate } from "./tag/state";
import { boot, render, tag } from "./tag/tag";

const CounterBtn = () => {
  const [getCount, setCount] = useMutate<number>(10);

  const onClick = () => {
    setCount((oldState) => {
      if (oldState < 20) {
        return oldState + 1;
      }
      return 1;
    });
    // console.log('old:', getCount())
  }

  render`label.teste`(() => ({}), () => {
    tag`button.test count: ${getCount()}`(() => ({
      'onclick': onClick,
      'data-teste': '15456',
      'class': 'other-classes aff',
      'style': `border:${getCount()}px solid blue; border-style: dashed;`,
    }));
  })
}

const OnlyBtn = () => {
  const [getCount, setCount] = useMutate<number>(1);

  const onClick = () => {
    setCount((oldState) => oldState + 1);
    // console.log('old:', getCount());
  }

  render`button.test ${getCount()}`(() => ({
    'onclick': onClick,
    'data-teste': '15456',
    // 'key': getCount(),
    'style': `border:${getCount()}px solid red; border-style: dashed;`,
    'class': 'other-classes aff',
  }));

}


const CounterApp = () => {
  const [getToggle, setToggle] = useMutate(true);

  const onClick = () => {
    setToggle((oldState) => !oldState);
  }

  render`h4.v3rtigo.ops.teste`(() => ({
    // 'onclick': onClick,
  }), () => {
    // if (getToggle()) {
    // }
    CounterBtn();
    OnlyBtn();
  });
}


export function setupCounterApp(element: HTMLElement) {
  boot(
    element,
    () => {
      CounterApp();
    }
  )
}
