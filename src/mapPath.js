import axios from 'axios'

const map = new AMap.Map('container', {
  center: [
    113.604140890091,
    23.1218012100185
  ],
  mapStyle: 'amap://styles/47cf2cc474c7ad6c92072f0b267adff0?isPublic=true',
  zooms: [3, 18],
  zoom: 15,
  features: ['bg', 'road']
});

AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier, $) => {

  const pathStyle = {
    strokeStyle: 'blue',
    lineWidth: 1,
    borderWidth: 0,
    dirArrowStyle: false
  };
  const dataPromise = axios.get('./route_link.json');
  // const dataPromise = import('./rl.json');

  dataPromise.then(data=>{
    pathSimplifierIns.setData(data.data.data);
  });

  const pathSimplifierIns = new PathSimplifier({
    zIndex: 100,
    map,
    getPath: function(pathData, pathIndex) {
      return pathData.trace.coordinates[0];
    },
    renderOptions: {
      startPointStyle: 'none',
      endPointStyle: 'none',
      getPathStyle(data) {
        const { num } = data.pathData;
        if(num < 5) {
          pathStyle.strokeStyle = 'green'
        } else if(num < 10) {
          pathStyle.strokeStyle = 'yellow'
        } else if(num < 15) {
          pathStyle.strokeStyle = 'orange'
        } else {
          pathStyle.strokeStyle = 'red'
        }
        return {
          pathLineStyle: pathStyle,
        };
      }
    }
  });
});

