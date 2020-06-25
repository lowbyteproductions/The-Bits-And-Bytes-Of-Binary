class Binary {
  constructor(bits) {
    this.bits = bits;
  }

  toNumber() {
    let total = 0;

    this.bits.forEach((bit, i) => {
      const powerOfTwo = this.bits.length - i - 1;
      if (bit === 1) {
        total += 2**powerOfTwo;
      }
    });

    return total;
  }
}

const fourBitNumber = new Binary([1, 1, 0, 0]);
console.log(fourBitNumber.toNumber());