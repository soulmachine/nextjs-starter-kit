import React from 'react'
import Link from 'next/link'
import { Provider } from 'mobx-react'
import { getSnapshot } from 'mobx-state-tree'
import initClockStore from '../stores/ClockStore'
import Clock from '../containers/Clock'

class ClockPage extends React.Component {
  static getInitialProps({ req }) {
    const isServer = !!req
    const clockStore = initClockStore(isServer)
    return { initialState: getSnapshot(clockStore), isServer }
  }

  constructor(props) {
    super(props)
    this.clockStore = initClockStore(props.isServer, props.initialState)
  }

  render() {
    return (
      <Provider clock = {this.clockStore}>
        <div>
          <h1>Clock</h1>
          <Clock />
        </div>
      </Provider>
    )
  }
}

export default ClockPage