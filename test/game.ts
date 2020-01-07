import 'should'
import Game, { State } from '../src/Game'
import Board, { Spot } from '../src/Board'

let game: Game

describe('Game', () => {
  beforeEach(() => game = new Game(Board))

  it('move piece', async () => {
    await game.start()

    const [[firstPiece, { moves: [firstMove] }]] = game.pieces
    await game.move(firstPiece, firstMove)

    game.pieces.has(firstMove).should.be.true()
    game.destructible.should.have.size(22)
    game.destructible.has([2, 0]).should.be.true()
  })

  it('destroy spot', async () => {
    await game.start()
    const [[firstPiece, { moves: [firstMove] }]] = game.pieces
    await game.move(firstPiece, firstMove)

    const [firstDestroy] = game.destructible
    await game.destroy(firstDestroy)

    await game.stateChange.next
    game.state.should.eql(State.MOVE)
    game.current.should.eql(Spot.WHITE)
  })
})
