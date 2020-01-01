import 'should'
import Game from '../src/Game'
import Board, { Spot } from '../src/Board'

let game: Game

describe('Game', () => {
  beforeEach(() => game = new Game(Board))

  it('positions match keys', () => {
    for (const [key, { position }] of game.pieces)
      position.toString().should.eql(key)
  })

  it('move piece', async () => {
    game.turnStarted.activate(Spot.BLACK)
    await game.boardChanged.next

    const [firstPiece] = game.pieces.values(),
      [firstMove] = firstPiece.moves.values()

    game.move(firstPiece.position, firstMove)
    await game.boardChanged.next

    game.pieces.has(firstMove.toString()).should.be.true()

  })
})
