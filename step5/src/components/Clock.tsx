import React from "react"

interface ClockProps { light: boolean; lastUpdate: Date }

export default (props: ClockProps) =>
  <div className={props.light ? "light" : ""}>
    {format(new Date(props.lastUpdate))}
    <style jsx>{`
      div {
        padding: 15px;
        color: #82FA58;
        display: inline-block;
        font: 50px menlo, monaco, monospace;
        background-color: #000;
      }

      .light {
        background-color: #999;
      }
    `}</style>
  </div>

const format = (t: Date) => `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`

const pad = (n: number) => n < 10 ? `0${n}` : n
