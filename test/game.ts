import 'should'
import Game from '../src/Game'
import Board from '../src/Board'

let game: Game

describe('Game', () => {
  beforeEach(() => game = new Game(Board))

  it('positions match keys', () => {
    for (const [key, { position }] of game.pieces)
      position.toString().should.eql(key)
  })

  it('move piece', async () => {
    game.start()
    await game.turn.next

    const [firstPiece] = game.pieces.values(),
      [firstMove] = firstPiece.moves.values()

    game.move(firstPiece.position, firstMove)
    const { position, destructible } = await game.moved.next

    game.pieces.has(firstMove.toString()).should.be.true()
    position.should.eql(firstMove)
    destructible.should.have.size(22)
  })
})
