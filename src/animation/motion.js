import React, {Component} from 'react'
import { Motion, spring, presets, TransitionMotion, StaggeredMotion } from 'react-motion'

export default class MotionDemo extends React.Component {

  handleRest = () => {
    console.log(1)
  }

  state = {
    items: [
      {
        key: '1',
        size: 20,
      },
      {
        key: '2',
        size: 20,
      },
      {
        key: '3',
        size: 20,
      },
    ]
  }

  willLeave = () => {
    return {width: spring(0, presets.gentle), height: spring(0, presets.gentle)};
  }

  willEnter = () => {
    return {width: spring(160, presets.gentle), height: spring(60, presets.gentle)};
  }

  handleReset = () => {
    this.setState({
      items: [
        {
          key: '1',
          size: 20,
        },
        {
          key: '2',
          size: 20,
        },
        {
          key: '3',
          size: 20,
        },
      ]
    })
  }

  handleStartAnimation = () => {
    this.setState({
      items: [
        {
          key: '2',
          size: 40,
        },
        {
          key: '4',
          size: 40,
        },
      ]
    })
  }

  renderTransition() {
    return <div>
      <div onClick={this.handleReset}>
        reset
      </div>
      <TransitionMotion
        styles={this.state.items.map(item=>(
          {
            key: item.key,
            style: {
              transform: `scale(${item.size*100/20}%)`
              // width: item.size,S
              // height: item.size
            }
          }
        ))}
        willLeave={this.willLeave}
        willEnter={this.willEnter}
      >{(styles) => (
        <div onClick={this.handleStartAnimation}>{
          styles.map(style=>{
            return <div key={style.key} style={{...style.style, background: 'red'}}>123</div>
          })}</div>
      )}
      </TransitionMotion>
    </div>
  }

  render() {
    // return this.renderTransition()

    return <Motion
      defaultStyle={{left: 10}}
      style={{left: spring(100, presets.wobbly)}}
      onRest={this.handleRest}
    >
      {(interpolatingStyle)=>{
        return <div style={{...interpolatingStyle, position: 'relative'}}>123</div>
      }}
    </Motion>
  }
}
