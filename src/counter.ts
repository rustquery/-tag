import { boot, open, tag, useState } from "./tag/tag";





const CounterApp = () => {
  const [getCount, setCount] = useState<number>(0);

  const onClick = () => {
    setCount((oldState) => oldState + 1);
    console.log('old:', getCount())
  }

  open`div`(() => {
    tag`button`({
      onclick: onClick,
      'data-teste': '15456',
    });
  })
}



export function setupCounterApp(element: HTMLElement) {
  boot(
    element,
    () => {
      CounterApp();
    }
  )
}
