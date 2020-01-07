import 'should'
import Game, { State } from '../src/Game'
import Board, { Spot } from '../src/Board'

let game: Game

describe('Game', () => {
  beforeEach(() => game = new Game(Board))

  it('move piece', async () => {
    game.start()
    await game.stateChange.next

    const [[firstPiece, { moves: [firstMove] }]] = game.pieces

    game.move(firstPiece, firstMove)
    const position = await game.moved.next

    game.pieces.has(firstMove).should.be.true()
    position.should.eql(firstMove)
    game.destructible.should.have.size(22)
    game.destructible.has([2, 0]).should.be.true()
  })

  it('destroy spot', async () => {
    game.start()
    await game.stateChange.next

    const [[firstPiece, { moves: [firstMove] }]] = game.pieces
    game.move(firstPiece, firstMove)
    await game.moved.next

    const [firstDestroy] = game.destructible
    game.destroy(firstDestroy)
    await game.destroyed.next

    await game.stateChange.next
    game.state.should.eql(State.MOVE)
    game.current.should.eql(Spot.WHITE)
  })
})
