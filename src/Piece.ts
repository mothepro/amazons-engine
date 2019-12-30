import { Position } from './Board.js'

export const enum Color {
  BLACK,
  WHITE,
}

export default class {
  constructor(
    readonly color: Color,
    public position: Position,
  ) { }
}
