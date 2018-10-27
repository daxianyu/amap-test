import React, {Component} from 'react'
import 'babel-polyfill'
import ReactDom from 'react-dom'
import {
  Polygon, BezierCurve,
  PathSimplifier, PathNavigator,
  TileLayerTraffic,
  AMap as AMapBinding
} from 'react-amap-binding/cjs';
import MotionDemo from "./animation/motion";

class Child extends Component {

  componentDidMount(){
    console.log(this.props.x)
  }

  render() {
    return <div>

    </div>
  }
}

class Root extends Component {
  state = {
    polygons: [{
      path: [
        [119.616619, 30.109718],
        [119.855572, 30.13585],
        [119.786907, 29.930169],
      ],
    }],
    pitch: 10,
  }

  render(){
    return <div>
      <MotionDemo/>
    </div>

    return <div style={{width: 600, height: 600}}>
      <AMapBinding
        onClick={()=>this.setState({pitch: this.state.pitch + 1})}
        pitch={this.state.pitch}
        version="1.4.10"
        // center={[116.397428, 39.90923]}
        // viewMode="3D"
        appKey="e15e343ed5f952efd7899005dc60900f">
        {/*{*/}
          {/*this.state.polygons.map((polygon, index) => {*/}
            {/*return (*/}
              {/*<Polygon*/}
                {/*key={index}*/}
                {/*{...polygon}*/}
              {/*/>*/}
            {/*);*/}
          {/*})*/}
        {/*}*/}
        {/*<BezierCurve*/}
          {/*path = {[*/}
            {/*[[121.162692, 30.253647]],*/}
            {/*[[120.162881, 30.254444], [120.164071, 30.254444]],*/}
          {/*]}*/}
          {/*strokeColor='red'*/}
          {/*strokeStyle='solid'*/}
        {/*/>*/}
        <PathSimplifier
          data={[{
            name: '轨迹0',
            path: [
              [120.432955, 30.234711],
              [120.183016, 30.243906],
              [120.163431, 30.254176],
            ],
          }, {
            name: '轨迹1',
            path: [
              [120.177591, 30.217746],
              [120.215529, 30.250078],
              [120.207117, 30.276618],
            ],
          }]}
          getPath={(pathData, pathIndex) => {
            return pathData.path;
          }}
          getHoverTitle={() => {
            return null;
          }}
          autoSetFitView={true}
          clickToSelectPath={false}
        >
          <PathNavigator
            loop={true}
            pathIndex={1}
          />
        </PathSimplifier>
        <TileLayerTraffic
          autoRefresh={true}
        />
      </AMapBinding>
    </div>
  }
}

ReactDom.render(<Root/>, document.getElementById('root'))


