import { types, applySnapshot } from "mobx-state-tree"

const ClockStore = types
  .model({
    lastUpdate: types.Date,
    light: types.boolean,
  })
  .actions((self) => {
    let timer;
    function start() {
      timer = setInterval(() => {
        // mobx-state-tree doesn't allow anonymous callbacks changing data
        // pass off to another action instead
        self.update();
      })
    }

    function update() {
      self.lastUpdate = Date.now()
      self.light = true
    }

    function stop() {
      clearInterval(timer);
    }

    return { start, stop, update }
  })

let clockStore = null

export default function initClockStore(isServer, snapshot = null) {
  if (isServer) {
    clockStore = ClockStore.create({ lastUpdate: Date.now(), light: false })
  }
  if (clockStore == null) {
    clockStore = ClockStore.create({ lastUpdate: Date.now(), light: false  })
  }
  if (snapshot) {
    applySnapshot(clockStore, snapshot)
  }
  return clockStore
}
