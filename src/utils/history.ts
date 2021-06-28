export default class History {
  private undoItems: any;
  private redoItems: any;
  constructor() {
    this.undoItems = [];
    this.redoItems = [];
  }
}
