import React from "react"
import Ticker from "./Ticker"

const styles = {
  textRancho: { fontFamily: "'Rancho', cursive" },
  textGochi: { fontFamily: "'Gochi Hand', cursive" },
  titleText: { fontSize: "5em", textAlign: "center", margin: "10px 0 0 0" },
  noSelect: {
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    khtmlUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  },
}

export default class Clock extends React.Component {
  defaultState = {
    breakLength: 5,
    sessionLength: 25,
    inSession: true,
    paused: true,
    time: 25 * 60 * 1000, // session time in milliseconds
    startTime: null,
    intervalId: null,
  }
  state = this.defaultState

  audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3")

  componentDidMount() {
    this.intervalId = setInterval(() => {
      if (!this.state.paused) {
        if (this.state.time - 500 <= 0) {
          // time has run out
          this.playSound()
          this.setState(currentState => {
            if (currentState.inSession) {
              // in a session and not a break
              // switch over to a break and set timer

              return {
                inSession: false,
                time: currentState.breakLength * 60 * 1000,
              }
            } else {
              // in a break and not a session
              // switch over to session and set timer
              return {
                inSession: true,
                time: currentState.sessionLength * 60 * 1000,
              }
            }
          })
        } else {
          this.setState(({ time }) => ({ time: time - 500 }))
        }
      }
    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  changeBreakLength = value =>
    this.setState(({ breakLength, time, inSession }) => {
      return inSession
        ? {
            breakLength: breakLength + value,
          }
        : {
            breakLength: breakLength + value,
            time: time + value * 1000 * 60, // add 1 minute * value
          }
    })

  changeSessionLength = value =>
    this.setState(({ sessionLength, time, inSession }) => {
      return inSession
        ? {
            sessionLength: sessionLength + value,
            time: time + value * 1000 * 60, // add 1 minute * value
          }
        : {
            sessionLength: sessionLength + value,
          }
    })

  startPause = () => this.setState(({ paused }) => ({ paused: !paused }))

  reset = () => this.setState(this.defaultState)

  playSound = () => {
    this.audio.play()
    setTimeout(() => this.audio.play(), 500)
    setTimeout(() => this.audio.play(), 1000)
    setTimeout(() => this.audio.play(), 1500)
    setTimeout(() => this.audio.play(), 2000)
  }

  calculateRadians = () => {
    const { inSession, time, breakLength, sessionLength } = this.state
    const totalTime = inSession
      ? sessionLength * 60 * 1000
      : breakLength * 60 * 1000
    return 2 * Math.PI * (1 - time / totalTime)
  }

  render() {
    const radians = this.calculateRadians()
    return (
      <section>
        <h1 style={{ ...styles.textRancho, ...styles.titleText }}>
          Pomodo Clock
        </h1>
        <h2 style={{ ...styles.textGochi, textAlign: "center", marginTop: 0 }}>
          by Gilgen Labs
        </h2>
        <div
          style={{
            display: "flex",
            ...styles.textGochi,
            textAlign: "center",
            fontSize: "2em",
          }}
        >
          <div style={styles.noSelect}>
            <h3 style={{ margin: 0, padding: "5px 13px 0 0" }}>Break Length</h3>
            <div style={{ lineHeight: "1em", fontSize: "2em" }}>
              <span onClick={() => this.changeBreakLength(-1)}>−</span>
              <span style={{ margin: "0 7px" }}>{this.state.breakLength}</span>
              <span onClick={() => this.changeBreakLength(1)}>+</span>
            </div>
          </div>
          <div style={styles.noSelect}>
            <h3 style={{ margin: 0, padding: "5px 0 0 13px" }}>
              Session Length
            </h3>
            <div style={{ lineHeight: "1em", fontSize: "2em" }}>
              <span onClick={() => this.changeSessionLength(-1)}>−</span>
              <span style={{ margin: "0 7px" }}>
                {this.state.sessionLength}
              </span>
              <span onClick={() => this.changeSessionLength(1)}>+</span>
            </div>
          </div>
        </div>
        <Ticker
          clickHandler={this.startPause}
          radians={radians}
          inSession={this.state.inSession}
          time={this.state.time}
        />
        <div
          style={{
            ...styles.textRancho,
            cursor: "pointer",
            textAlign: "center",
            fontSize: "2em",
          }}
          onClick={this.reset}
        >
          reset
        </div>
      </section>
    )
  }
}
