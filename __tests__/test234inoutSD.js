/* global test, expect */

const trilat234inoutSD = require('../trilat234inoutSD')
const {getDistance} = require('../utils')
const {getRoomCenter} = require('./misc')

// all wiranges have zero height (2d-mode)
const ROOM = [
  { id: 21, x: 30.510815510, y: 50.437594417, z: 0, dist: 0},
  { id: 41, x: 30.510934197, y: 50.437592389, z: 0, dist: 0},
  { id: 31, x: 30.510972574, y: 50.437535780, z: 0, dist: 0},
  { id: 47, x: 30.510791035, y: 50.437548826, z: 0, dist: 0}
]
// approx room center, can be hardcoded
const ROOM_CENTER = getRoomCenter(ROOM)

// change distance for each signal without changing coordinates and z
// by default all test distances are equal to 3.0 meters
function makeSignals (room, distances = [3.0, 3.0, 3.0, 3.0]) {
  return room.map((device, i) => (Object.assign({}, device, {dist: distances[i]})))
}

test('should return point which is closer than 10 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 4 points', () => {
  let signals = makeSignals(ROOM, [21.05, 10.07, 1.04, 35.01])
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 10 m to the bounds
  expect(pos.outDist).toBeLessThan(10)
})

test('should return point which is closer than 10 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 3 points', () => {
  let signals = makeSignals(ROOM, [0, 10.07, 1.04, 25.01]).slice(1, 4)
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 10 m to the bounds
  expect(pos.outDist).toBeLessThan(10)
})

test('should return point which is closer than 10 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 2 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 10.04, 15.01]).slice(2, 4)
  let pos = trilat234inoutSD(signals, {z: 1.7})
  // ensure that point found is closer than 10 m to the bounds
  expect(pos.outDist).toBeLessThan(10)
})

test('should return point which is closer than 8 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 4 points', () => {
  let signals = makeSignals(ROOM, [21.05, 10.07, 1.04, 35.01])
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 8 m to the bounds
  expect(pos.outDist).toBeLessThan(8)
})

test('should return point which is closer than 8 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 3 points', () => {
  let signals = makeSignals(ROOM, [0, 10.07, 1.04, 25.01]).slice(1, 4)
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 8 m to the bounds
  expect(pos.outDist).toBeLessThan(8)
})

test('should return point which is closer than 8 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 2 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 10.04, 15.01]).slice(2, 4)
  let pos = trilat234inoutSD(signals, {z: 1.7})
  // ensure that point found is closer than 8 m to the bounds
  expect(pos.outDist).toBeLessThan(8)
})

test('should return point which is closer than 4 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 4 points', () => {
  let signals = makeSignals(ROOM, [21.05, 10.07, 1.04, 35.01])
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 4 m to the bounds
  expect(pos.outDist).toBeLessThan(4)
})

test('should return point which is closer than 4 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 3 points', () => {
  let signals = makeSignals(ROOM, [0, 10.07, 1.04, 25.01]).slice(1, 4)
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 4 m to the bounds
  expect(pos.outDist).toBeLessThan(4)
})

test('should return point which is closer than 4 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 2 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 10.04, 15.01]).slice(2, 4)
  let pos = trilat234inoutSD(signals, {z: 1.7})
  // ensure that point found is closer than 4 m to the bounds
  expect(pos.outDist).toBeLessThan(4)
})

test('should return point which is closer than 2 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 4 points', () => {
  let signals = makeSignals(ROOM, [21.05, 10.07, 1.04, 35.01])
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 2 m to the bounds
  expect(pos.outDist).toBeLessThan(2)
})

test('should return point which is closer than 2 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 3 points', () => {
  let signals = makeSignals(ROOM, [0, 10.07, 1.04, 25.01]).slice(1, 4)
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 2 m to the bounds
  expect(pos.outDist).toBeLessThan(2)
})

test('should return point which is closer than 2 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 2 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 10.04, 15.01]).slice(2, 4)
  let pos = trilat234inoutSD(signals, {z: 1.7})
  // ensure that point found is closer than 2 m to the bounds
  expect(pos.outDist).toBeLessThan(2)
})

test('should return point which is closer than 1 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 4 points', () => {
  let signals = makeSignals(ROOM, [21.05, 10.07, 1.04, 35.01])
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 1 m to the bounds
  expect(pos.outDist).toBeLessThan(1)
})

test('should return point which is closer than 1 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 3 points', () => {
  let signals = makeSignals(ROOM, [0, 10.07, 1.04, 25.01]).slice(1, 4)
  let pos = trilat234inoutSD(signals, {z: 1.5})
  // ensure that point found is closer than 1 m to the bounds
  expect(pos.outDist).toBeLessThan(1)
})

test('should return point which is closer than 1 m to the bounds - if the solution inside' +
'the room tested doesn`t exists but exist outside the room - for 2 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 10.04, 15.01]).slice(2, 4)
  let pos = trilat234inoutSD(signals, {z: 1.7})
  // ensure that point found is closer than 1 m to the bounds
  expect(pos.outDist).toBeLessThan(1)
})

test('should have same z as target for 4 points', () => {
  let z = 0
  let results = trilat234inoutSD(makeSignals(ROOM), {z})
  expect(results.z).toBe(0)
})

test('should work for 4 points', () => {
  let signals = makeSignals(ROOM)
  expect(signals.length).toBe(4)
  let pos = trilat234inoutSD(signals, {z: 0})
  expect(pos.z).toBe(0) // z should match
})

test('should work for 3 points', () => {
  let signals = makeSignals(ROOM).slice(0, 3)
  expect(signals.length).toBe(3)
  let pos = trilat234inoutSD(signals, {z: 0})
  expect(pos.z).toBe(0) // z should match
})

test('should work for 2 points', () => {
  let signals = makeSignals(ROOM).slice(0, 2)
  expect(signals.length).toBe(2)
  let pos = trilat234inoutSD(signals, {z: 0})
  expect(pos.z).toBe(0) // z should match
})

test('should place first point near center when all distances are equal 1.0', () => {
  let signals = makeSignals(ROOM, [1.0, 1.0, 1.0, 1.0])
  let pos = trilat234inoutSD(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers
  expect(pos.x).toBeGreaterThan(30)
  expect(pos.y).toBeGreaterThan(50)
  expect(getDistance(pos, ROOM_CENTER)).toBeLessThan(0.1)
})

test('should place first point near center when all distances are equal 2.0', () => {
  let signals = makeSignals(ROOM, [2.0, 2.0, 2.0, 2.0])
  let pos = trilat234inoutSD(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers
  expect(pos.x).toBeGreaterThan(30)
  expect(pos.y).toBeGreaterThan(50)
  expect(getDistance(pos, ROOM_CENTER)).toBeLessThan(0.1)
})

test('should find the solution for 4 points if the solution exists', () => {
  let signals = makeSignals(ROOM, [2.11, 3.15, 6.04, 5.87])
  let pos = trilat234inoutSD(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers and located in the room
  expect(pos.x).toBeGreaterThan(30.510781035)
  expect(pos.y).toBeGreaterThan(50.437526826)
  expect(pos.x).toBeLessThan(30.510986574)
  expect(pos.y).toBeLessThan(50.437600417)
})

test('should find the solution for 3 points if the solution exists', () => {
  let signals = makeSignals(ROOM, [0, 3.15, 6.04, 5.87]).slice(1, 4)
  let pos = trilat234inoutSD(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers and located in the room
  expect(pos.x).toBeGreaterThan(30.510781035)
  expect(pos.y).toBeGreaterThan(50.437526826)
  expect(pos.x).toBeLessThan(30.510986574)
  expect(pos.y).toBeLessThan(50.437600417)
})

test('should find the solution for 2 points if the solution exists', () => {
  let signals = makeSignals(ROOM, [0, 0, 6.39, 6.87]).slice(2, 4)
  let pos = trilat234inoutSD(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers and located in the room
  expect(pos.x).toBeGreaterThan(30.510781035)
  expect(pos.y).toBeGreaterThan(50.437526826)
  expect(pos.x).toBeLessThan(30.510986574)
  expect(pos.y).toBeLessThan(50.437600417)
})

test('should return "undefined" for 1 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 0, 2.02]).slice(3, 4)
  let pos = trilat234inoutSD(signals, {z: 0})
  // ensure that pos is undefined
  expect(pos).toBe(undefined)
})

test('should return "undefined" for 0 points', () => {
  let pos = trilat234inoutSD([], {z: 0})
  // ensure that pos is undefined
  expect(pos).toBe(undefined)
})

test('should find the solution with distances to 3 or 4 WRs close to the incoming - for 4 points', () => {
  let signals = makeSignals(ROOM, [2.11, 3.15, 6.04, 5.87])
  let pos = trilat234inoutSD(signals, {z: 0})
  // ensure that at least 3 distances from pos to WRs differs from the corresponding incoming
  // distances by less than 2.5 meter
  let count = 0
  for (let i = 0; i < 4; i++) {
    if (Math.abs(getDistance(pos, ROOM[i]) - signals[i].dist) < 2.5) {
      count++
    }
  }
  expect(count).toBeGreaterThan(2)
})
