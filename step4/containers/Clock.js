import React from 'react'
import { inject, observer } from 'mobx-react'
import Clock from '../components/Clock'

@inject('clock') @observer
class ClockContainer extends React.Component {
  componentDidMount() {
    this.props.clock.start()
  }

  componentWillUnmount() {
    this.props.clock.stop()
  }

  render() {
    return (
      <Clock lastUpdate={this.props.clock.lastUpdate} light={this.props.clock.light} />
    )
  }
}

export default ClockContainer
