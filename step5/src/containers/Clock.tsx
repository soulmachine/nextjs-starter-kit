import { inject, observer } from "mobx-react"
import React from "react"
import Clock from "../components/Clock"
import { IClockStore } from "../stores/ClockStore"

export interface ClockContainerProps {
  clock: IClockStore
}

@inject("clock")
@observer
class ClockContainer extends React.Component<ClockContainerProps, any> {
  public componentDidMount() {
    this.props.clock!.start()
  }

  public componentWillUnmount() {
    this.props.clock.stop()
  }

  public render() {
    return (
      <Clock
        lastUpdate={this.props.clock.lastUpdate}
        light={this.props.clock.light}
      />
    )
  }
}

export default ClockContainer
