import { setupCounterApp } from './counter.ts'
import './style.css'
import viteLogo from '/vite.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="logos">
      <a href="https://vitejs.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://github.com/rustquery/-tag" target="_blank">
        <span class="tag">
          @angular
        </span>
      </a>
    </div>
    <h1>Vite + @angular</h1>
    <div class="card" id="counter_app">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and @tag logos to learn more
    </p>
  </div>
`

setupCounterApp(document.querySelector<HTMLElement>('#counter_app')!)
