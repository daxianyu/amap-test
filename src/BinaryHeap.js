export class BinaryHeap {
  constructor(scoreFunc) {
    this.content = []
    this.scoreFunction = scoreFunc
  }

  bubbleUp(n) {
    const element = this.content[n], score = this.scoreFunction(element);

    while (n > 0) {
      const parentN = Math.floor((n + 1) / 2) - 1
      const parent = this.content[parentN]
      if (score >= this.scoreFunction(parent)){
        break;
      }
      this.content[parentN] = element
      this.content[n] = parent
      n = parentN
    }
  }

  push(element) {
    this.content.push(element)
    this.bubbleUp(this.content.length - 1)
  }
}
