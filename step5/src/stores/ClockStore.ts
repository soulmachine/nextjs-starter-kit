import { applySnapshot, types } from "mobx-state-tree"

const ClockStore = types
  .model({
    lastUpdate: types.Date,
    light: types.boolean
  })
  .actions(self => {
    function update() {
      self.lastUpdate = new Date()
      self.light = true
    }
    return { update }
  })
  .actions(self => {
    let timer: any
    function start() {
      timer = setInterval(() => {
        // mobx-state-tree doesn't allow anonymous callbacks changing data
        // pass off to another action instead
        self.update()
      })
    }

    function stop() {
      clearInterval(timer)
    }

    return { start, stop }
  })

export type IClockStore = typeof ClockStore.Type
let clockStore: IClockStore

export function initClockStore(
  isServer: boolean,
  snapshot?: object
): IClockStore {
  if (isServer) {
    clockStore = ClockStore.create({ lastUpdate: Date.now(), light: false })
  }
  if (clockStore == null) {
    clockStore = ClockStore.create({ lastUpdate: Date.now(), light: false })
  }
  if (snapshot) {
    applySnapshot(clockStore, snapshot)
  }
  return clockStore
}
