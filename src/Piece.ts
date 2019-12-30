import { Position } from './Board.js'

export const enum Color {
  BLACK,
  WHITE,
}

export default class {
  validMoves!: Set<Position>

  constructor(
    readonly color: Color,
    public position: Position,
  ) { }
}
