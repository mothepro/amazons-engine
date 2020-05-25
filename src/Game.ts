import { SafeEmitter, Emitter } from 'fancy-emitter'
import Board, { Spot, Position, Color, isColor } from './Board.js'
import validMoves from './validMoves.js'
import LooseMap from '@mothepro/loose-map'
import LooseSet from '@mothepro/loose-set'

export const enum State {
  /** Game is waiting to be started. */
  WAITING,
  /** Turn just started and the current player needs to move a piece. */
  MOVE,
  /** Current player needs to destroy a spot to end their turn. */
  DESTROY,
}

export default class {
  /** @readonly The next action that needs to be preformed. */
  state = State.WAITING

  /** @readonly current player's color. */
  current: Color = Spot.WHITE

  /** @readonly the other player's color. */
  get waiting(): Color {
    return this.current == Spot.BLACK
      ? Spot.WHITE
      : Spot.BLACK
  }

  /**
   * The board has been changed.
   * The pieces valid moves need to re calculated.
   * 
   * Activate this immediately to calculate the valid moves on initialization.
   */
  private readonly calcPieces = () => {
    this.pieces.clear()
    for (const [y, row] of this.board.entries())
      for (const [x, spot] of row.entries())
        if (isColor(spot))
          this.pieces.set([x, y], {
            color: spot,
            moves: validMoves(this.board, [x, y]),
          })
  }

  /**
   * The state of the game has changed.
   * 
   * Cancels once the current player can not make any moves.
   * `this.waiting` is the winner.
   */
  readonly stateChange = new Emitter<State>(
    /* Bind state to this emitter
     * 
     * If a move is needed
     * + Swap the current player
     * + End the game if there aren't any moves left for the current player
     * 
     * If a destroy is needed
     * + Starts the next turn automatically if destroying isn't possible
     */
    newState => {
      switch (this.state = newState) {
        case State.MOVE:
          this.current = this.waiting

          if ([...this.pieces.values()]
            .filter(({ color }) => this.current == color)
            .every(({ moves }) => moves.size == 0))
            this.stateChange.cancel()
          break

        case State.DESTROY:
          if (this.destructible.size == 0)
            this.stateChange.activate(State.MOVE)
          break
      }
    })

  /** Activated when a piece has been moved. */
  readonly moved = new SafeEmitter<Position>(
    /** Update pieces since board has changed. */
    this.calcPieces,

    /** Set the new destructible spots. */
    position => this.destructible = this.pieces.get(position)!.moves,

    /** Destroy is needed after moving piece. */
    () => this.stateChange.activate(State.DESTROY))

  /** Activated when a spot on the board has been destroyed. */
  readonly destroyed = new SafeEmitter<Position>(
    /** The possible destructible spots are no longer relevant. */
    () => this.destructible.clear(),

    /** Update pieces since board has changed. */
    this.calcPieces,

    /** Start the next turn. */
    () => this.stateChange.activate(State.MOVE))

  /** 
   * All piece's color, position & their valid moves.
   * keyed by the piece's position stringified. (Using an array as a key isn't possible due to references vs value)
   */
  readonly pieces = new LooseMap<Position, {
    color: Color
    moves: LooseSet<Position>
  }>()

  /** @readonly list of hashed positions that can be destroyed if that is the required action. */
  destructible = new LooseSet<Position>()

  /** Starts the game with Black's turn first. */
  async start() {
    await this.stateChange.activate(State.MOVE).next
  }

  /** Destroys a position on the board and flips the players turn. */
  async destroy([x, y]: Position) {
    this.board[y][x] = Spot.DESTROYED
    await this.destroyed.activate([x, y]).next
  }

  /**
   * Moves a piece to a new position on the board without checking.
   * Clears the spot on the board where the piece was and updates the piece and the board.
   */
  async move([fromX, fromY]: Position, [toX, toY]: Position) {
    this.board[toY][toX] = this.board[fromY][fromX]
    this.board[fromY][fromX] = Spot.EMPTY
    await this.moved.activate([toX, toY]).next
  }

  constructor(readonly board = Board) { this.calcPieces() }
}
