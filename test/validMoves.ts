import 'should'
import validMoves from '../src/validMoves'
import Board from '../src/Board'

it('should find all valid moves from corner of board', () => {
  [...validMoves(Board, [0, 0])].should.eql([
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

