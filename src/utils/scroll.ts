export default class Scroll {
  private x: number;
  private y: number;
  private ri: number;
  private ci: number;
  constructor() {
    this.x = 0; // left
    this.y = 0; // top
    this.ri = 0; // cell row-index
    this.ci = 0; // cell col-index
  }
}
