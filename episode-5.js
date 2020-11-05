const combineMap = (a1, a2, fn) => {
  return a1.map((x, i) => fn(x, a2[i]));
};

const reverse = a => [...a].reverse();

class Binary {
  constructor(bits) {
    this.bits = bits;
  }

  assertSameNumberOfBits(other) {
    if (other.bits.length !== this.bits.length) {
      throw new Error(`Bit mismatch (a = ${this.bits.length}, b = ${other.bits.length})`);
    }
  }

  assertIsBinary(other) {
    if (!(other instanceof Binary)) {
      throw new Error(`Not an instance of Binary`);
    }
  }

  static fromUnsigned(n) {
    if (!Number.isInteger(n)) {
      throw new Error(`Can only create Binary from integers.`);
    }

    if (n === 0) {
      return new Binary([0]);
    }

    const bits = [];
    let nearestPowerOfTwo = Math.floor(Math.log2(n));
    let numberInProgress = n;

    while (nearestPowerOfTwo >= 0) {
      if (numberInProgress >= 2**nearestPowerOfTwo) {
        bits.push(1);
        numberInProgress -= 2**nearestPowerOfTwo;
      } else {
        bits.push(0);
      }
      nearestPowerOfTwo -= 1;
    }
    return new Binary(bits);
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

  zeroExtend(nBits) {
    if (nBits <= this.bits.length) {
      throw new Error(`Need to extend to a larger number of bits (current = ${this.bits.length}, target = ${nBits})`);
    }

    const numberExtraZeros = nBits - this.bits.length;
    const zeros = Array.from({length: numberExtraZeros}, () => 0);
    return new Binary([...zeros, ...this.bits]);
  }

  zeroExtendToMatch(other) {
    this.assertIsBinary(other);
    return this.zeroExtend(other.bits.length);
  }

  add(other) {
    this.assertIsBinary(other);
    this.assertSameNumberOfBits(other);

    let carryBit = 0;

    const newBits = combineMap(reverse(this.bits), reverse(other.bits), (a, b) => {
      const abSum = a ^ b;
      const abCarry = a & b;

      const abSumPlusCarry = abSum ^ carryBit;
      const abSumCarry = abSum & carryBit;

      carryBit = abCarry | abSumCarry;
      return abSumPlusCarry;
    });

    return new Binary([carryBit, ...reverse(newBits)]);
  }

  and(other) {
    this.assertIsBinary(other);
    this.assertSameNumberOfBits(other);
    const newBits = combineMap(this.bits, other.bits, (bit1, bit2) => bit1 & bit2);
    return new Binary(newBits);
  }

  or(other) {
    this.assertIsBinary(other);
    this.assertSameNumberOfBits(other);
    const newBits = combineMap(this.bits, other.bits, (bit1, bit2) => bit1 | bit2);
    return new Binary(newBits);
  }

  xor(other) {
    this.assertIsBinary(other);
    this.assertSameNumberOfBits(other);
    const newBits = combineMap(this.bits, other.bits, (bit1, bit2) => bit1 ^ bit2);
    return new Binary(newBits);
  }

  not() {
    const newBits = this.bits.map(x => x === 0 ? 1 : 0);
    return new Binary(newBits);
  }
}

const a = Binary.fromUnsigned(11);
const b = Binary.fromUnsigned(5).zeroExtendToMatch(a);

console.log(a.add(b));