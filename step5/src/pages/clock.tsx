import { Provider } from "mobx-react"
import { getSnapshot } from "mobx-state-tree"
import {Context} from "next"
import Link from "next/link"
import React from "react"
import ClockContainer, {ClockContainerProps} from "../containers/Clock"
import {IClockStore, initClockStore} from "../stores/ClockStore"

interface ClockPageProps {isServer: boolean; initialState: IClockStore}
interface ClockPageState {clockStore: IClockStore}

class ClockPage extends React.Component<ClockPageProps, ClockPageState> {
  public static async getInitialProps(context: Context) {
    const {req} = context
    const isServer = !!req
    const clockStore = initClockStore(isServer)
    return { initialState: getSnapshot(clockStore), isServer }
  }

  constructor(props: ClockPageProps) {
    super(props)
    this.state = {clockStore: initClockStore(props.isServer, props.initialState)}
  }

  public render() {
    return (
      <Provider clock = {this.state.clockStore}>
        <div>
          <h1>Clock</h1>
          <ClockContainer { ...({} as ClockContainerProps) } />
        </div>
      </Provider>
    )
  }
}

export default ClockPage
