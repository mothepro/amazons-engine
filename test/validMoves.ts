import 'should'
import validMoves from '../src/validMoves'
import simpleBoard from './simpleBoard'

it('should find all valid moves from corner of board', () => {
  [...validMoves(simpleBoard, [0, 0])].should.eql([
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 7]
  ])
})

