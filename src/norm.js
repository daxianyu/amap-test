import { normalize, schema, denormalize } from 'normalizr';
import {createSelector, createSelectorCreator, defaultMemoize} from 'reselect'

const data = require('./data.json')
const data1 = require('./data1.json')

const moduleName = new schema.Entity('moduleName')

const lastSchema = new schema.Entity('last', {}, {
  idAttribute: 'moduleId'
})

const blockSchema = new schema.Entity('block', {
  children: [lastSchema]
}, {
  idAttribute: 'moduleId'
})

const pageSchema = new schema.Entity('page', {
  children: [blockSchema]
}, {
  idAttribute: 'moduleId'
})

const pagesSchema = new schema.Array(pageSchema)
let a = normalize(data.data, pagesSchema)

const raw = denormalize(a.result, pagesSchema, a.entities)

const s0 = state => {
  console.log('1')
  return state
}

function filterIds(lastList, list) {
  console.log('2')
  return list
    .filter(item=>item.show)
    .map(item=>item.moduleId).concat(lastList)
}

const selectId = createSelector(
  ()=>[], s0, filterIds
)

const selectBlockChild = ()=>{
  const result = denormalize({block: Object.keys(a.entities.block)}, {block: [blockSchema]}, a.entities)
  return result.block
}

const selectBlockIds = createSelector(
  selectId, selectBlockChild, filterIds
)

const selectListChild = () => {
  const result = denormalize({last: Object.keys(a.entities.last)}, {last: [lastSchema]}, a.entities)
  return result.last
}

const selectLastIds = createSelector(
  selectBlockIds, selectListChild, filterIds
)

let x
console.time('test')
x = selectLastIds(raw)
console.timeEnd('test')
console.log(x)

console.time('test')
console.timeEnd('test')
console.log(x)

console.time('test')
console.timeEnd('test')
console.log(x)

console.time('test')
a = normalize(data1.data, pagesSchema)
console.timeEnd('test')
console.time('test')
x = selectLastIds(raw)
console.timeEnd('test')
console.log(x)


const s1 = createSelector(
  s0, page => {
    return page.map(item=>{
      const {show, moduleName, moduleType, moduleId} = item

      return {
        show, moduleId, moduleName, moduleType
      }
    })
  }
)

const s2 = createSelector(
  s1, (state) => {
    return state
  }
)
console.log(selectId(raw))
console.log(s2(raw))
