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
    strokeStyle: 'rgba(255,217,0,1)',
    lineWidth: 1,
    borderWidth: 0,
    dirArrowStyle: false
  };
  const dataPromise = axios.get('./route_od.json');
  // const dataPromise = import('./rl.json');

  dataPromise.then(data=>{
    pathSimplifierIns.setData(data.data.data);
  });

  const pathSimplifierIns = new PathSimplifier({
    zIndex: 100,
    map,
    getPath: function(pathData, pathIndex) {
      return pathData.track;
    },
    renderOptions: {
      startPointStyle: 'none',
      endPointStyle: 'none',
      getPathStyle(data) {
        const { od } = data.pathData;
        if (od < 200) {
          pathStyle.lineWidth = 1
        } else if (od < 400) {
          pathStyle.lineWidth = 2
        } else if(od < 1000) {
          pathStyle.lineWidth = 3
        } else if(od < 2500) {
          pathStyle.lineWidth = 4
        } else if(od < 8000) {
          pathStyle.lineWidth = 8
        } else {
          pathStyle.lineWidth = 15;
        }
        return {
          pathLineStyle: pathStyle,
        };
      }
    }
  });
});

