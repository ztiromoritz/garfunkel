let X_IS_LEFT_TO_Y = true;

export const Coord = {
  /**
   * General orientation of the coordinate system. This is a global setting for this module.
   *
   * Used for the isLeftOf, isRightOf, getLeftNormal, getRightNormal functions.
   *
   * FALSE, means the normal school book coordinates with (0,0) in the lower left corner.
   * TRUE, means the canvas or graphic coordinates with (0,0) in the upper left corner;
   *
   * @static
   * @default "true"
   * @return {boolean}
   */
  getXIsLeftOfY() {
    return X_IS_LEFT_TO_Y;
  },

  /**
   *
   * @static
   * @default "true"
   * @param {boolean} value
   */
  setXisLeftOfY(value: boolean) {
    X_IS_LEFT_TO_Y = value;
  },

  /**
   * @example
   * Garfunkel.setGameCoords();
   * var v = new Vect(2,2);
   * var w = v.clone().turnLeft().mul(0.5);
   * draw(v, 'red');
   * draw(w, 'green');
   * print(v)
   * print(w)
   * @static
   */
  setGameCoords() {
    X_IS_LEFT_TO_Y = true;
  },

  /**
   * @example
   * Garfunkel.setSchoolCoords();
   * var v = new Vect(2,2);
   * var w = v.clone().turnLeft().mul(0.5);
   * draw(v, 'red');
   * draw(w, 'green');
   * @static
   */
  setSchoolCoords() {
    X_IS_LEFT_TO_Y = false;
  },
};
