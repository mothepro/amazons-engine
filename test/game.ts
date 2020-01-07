import 'should'
import Game from '../src/Game'
import Board from '../src/Board'

let game: Game

describe('Game', () => {
  beforeEach(() => game = new Game(Board))

  it('move piece', async () => {
    game.start()
    await game.turn.next

    const [[firstPiece, { moves: [firstMove] }]] = game.pieces

    game.move(firstPiece, firstMove)
    const position = await game.moved.next

    game.pieces.has(firstMove).should.be.true()
    position.should.eql(firstMove)
    game.destructible.should.have.size(22)
    game.destructible.has([2, 0]).should.be.true()
  })
})
