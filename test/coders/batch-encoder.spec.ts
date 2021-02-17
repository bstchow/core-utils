import '../setup'

/* Internal Imports */
import {
  ctcCoder,
  encodeAppendSequencerBatch,
  decodeAppendSequencerBatch,
  TxType,
} from '../../src'
import { expect } from 'chai'

describe('BatchEncoder', () => {
  describe('eip155TxData', () => {
    it('should encode & then decode to the correct value', () => {
      const eip155TxData = {
        sig: {
          v: 1,
          r: '0x' + '11'.repeat(32),
          s: '0x' + '22'.repeat(32),
        },
        gasLimit: 500,
        gasPrice: 100,
        nonce: 100,
        target: '0x' + '12'.repeat(20),
        data: '0x' + '99'.repeat(10),
        type: TxType.EIP155,
      }
      const encoded = ctcCoder.eip155TxData.encode(eip155TxData)
      const decoded = ctcCoder.eip155TxData.decode(encoded)
      expect(eip155TxData).to.deep.equal(decoded)
    })
  })

  describe('appendSequencerBatch', () => {
    it('should work with the simple case', () => {
      const batch = {
        shouldStartAtBatch: 0,
        totalElementsToAppend: 0,
        contexts: [],
        transactions: [],
      }
      const encoded = encodeAppendSequencerBatch(batch)
      const decoded = decodeAppendSequencerBatch(encoded)
      expect(decoded).to.deep.equal(batch)
    })

    it('should work with more complex case', () => {
      const batch = {
        shouldStartAtBatch: 10,
        totalElementsToAppend: 1,
        contexts: [
          {
            numSequencedTransactions: 2,
            numSubsequentQueueTransactions: 1,
            timestamp: 100,
            blockNumber: 200,
          },
        ],
        transactions: ['0x45423400000011', '0x45423400000012'],
      }
      const encoded = encodeAppendSequencerBatch(batch)
      const decoded = decodeAppendSequencerBatch(encoded)
      expect(decoded).to.deep.equal(batch)
    })
  })

  describe('generic ctcCoder', () => {
    it('should decode EIP155 txs to the correct value', () => {
      const eip155TxData = {
        sig: {
          v: 1,
          r: '0x' + '11'.repeat(32),
          s: '0x' + '22'.repeat(32),
        },
        gasLimit: 500,
        gasPrice: 100,
        nonce: 100,
        target: '0x' + '12'.repeat(20),
        data: '0x' + '99'.repeat(10),
        type: TxType.EIP155,
      }
      const encoded = ctcCoder.encode(eip155TxData)
      const decoded = ctcCoder.decode(encoded)
      expect(eip155TxData).to.deep.equal(decoded)
    })

    it('should return null when encoding an unknown type', () => {
      const weirdTypeTxData = {
        sig: {
          v: 1,
          r: '0x' + '11'.repeat(32),
          s: '0x' + '22'.repeat(32),
        },
        gasLimit: 500,
        gasPrice: 100,
        nonce: 100,
        target: '0x' + '12'.repeat(20),
        data: '0x' + '99'.repeat(10),
        type: 420,
      }
      const encoded = ctcCoder.encode(weirdTypeTxData)
      expect(encoded).to.be.null
    })
  })
})
