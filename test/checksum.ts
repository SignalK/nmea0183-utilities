import { expect } from 'chai'
import * as utils from '../src/index'

describe('CheckSum', function () {
  const sentence1 = '$GPBOD,045.,T,023.,M,DEST,START'
  it('Checksum should be added and equal *01', function (done) {
    expect(utils.appendChecksum(sentence1)).to.equal(
      '$GPBOD,045.,T,023.,M,DEST,START*01'
    )
    done()
  })

  const sentence2 = '!GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,'
  it('Checksum should be added and equal *6F', function (done) {
    expect(utils.appendChecksum(sentence2)).to.equal(
      '!GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F'
    )
    done()
  })

  const sentence3 = '#GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,'
  it('Checksum should not be appended', function (done) {
    expect(utils.appendChecksum(sentence3)).to.equal(
      '#GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,'
    )
    done()
  })

  const sentence4 =
    '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6A'
  it('Checksum should not be recalculated to *6F', function (done) {
    expect(utils.appendChecksum(sentence4)).to.equal(
      '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6A'
    )
    done()
  })

  const sentence5 = '$GPBOD,045.,T,023.,M,DEST*,START*'
  it('Checksum should not be appended', function (done) {
    expect(utils.appendChecksum(sentence5)).to.equal(
      '$GPBOD,045.,T,023.,M,DEST*,START*'
    )
    done()
  })

  it('Checksum is valid', function (done) {
    expect(
      utils.valid(
        '!GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F',
        true
      )
    ).to.equal(true)
    done()
  })

  it('Checksum is invalid', function (done) {
    expect(utils.valid(sentence4, true)).to.equal(false)
    done()
  })

  it('Checksum is invalid but should not be checked', function (done) {
    expect(utils.valid(sentence4, false)).to.equal(true)
    done()
  })

  // valid() edge cases that weren't covered.
  it('empty string is not valid', function (done) {
    expect(utils.valid('', true)).to.equal(false)
    expect(utils.valid('   ', true)).to.equal(false)
    done()
  })

  it('sentence without $ or ! prefix is not valid', function (done) {
    expect(
      utils.valid('GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F')
    ).to.equal(false)
    done()
  })

  it('validateChecksum defaults to true when omitted', function (done) {
    // sentence4 has an invalid checksum; default should reject.
    expect(utils.valid(sentence4)).to.equal(false)
    done()
  })

  // valid() trims surrounding whitespace before parsing. A mutation
  // that drops the .trim() would fail to match the leading/trailing
  // chars and return false for an otherwise-valid sentence.
  it('accepts valid sentence with surrounding whitespace', function (done) {
    expect(
      utils.valid(
        '  !GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F  ',
        true
      )
    ).to.equal(true)
    done()
  })

  // appendChecksum also trims before inspecting the input.
  it('appendChecksum strips surrounding whitespace before processing', function (done) {
    expect(
      utils.appendChecksum('  $GPBOD,045.,T,023.,M,DEST,START  ')
    ).to.equal('$GPBOD,045.,T,023.,M,DEST,START*01')
    done()
  })

  // Cover both leading-character variants explicitly. `validateChecksum=false`
  // must accept both `$` and `!` prefixes even when the `*XX` suffix is absent.
  it('validateChecksum=false accepts $-prefixed sentence without suffix', function (done) {
    expect(utils.valid('$GPBOD,045.,T,023.,M,DEST,START', false)).to.equal(true)
    done()
  })

  it('validateChecksum=false accepts !-prefixed sentence without suffix', function (done) {
    expect(
      utils.valid(
        '!GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,',
        false
      )
    ).to.equal(true)
    done()
  })

  // Rejects a prefix-matching sentence that lacks the *XX suffix when
  // validateChecksum is defaulted to true.
  it('default validateChecksum rejects $-prefixed sentence with no *XX suffix', function (done) {
    expect(utils.valid('$GPBOD,045.,T,023.,M,DEST,START')).to.equal(false)
    done()
  })

  // Rejects a checksum-valid sentence whose leading character is neither
  // $ nor !. The body '#GPBOD,045.,T,023.,M,DEST,START*01' has a valid
  // checksum (checksum iteration starts at index 1, so the leading char
  // is ignored in computation, but the prefix check must still reject).
  it('rejects a checksum-valid sentence with an invalid leading character', function (done) {
    expect(utils.valid('#GPBOD,045.,T,023.,M,DEST,START*01', true)).to.equal(
      false
    )
    done()
  })

  // Rejects a $-prefixed sentence whose body happens to have a valid
  // checksum but whose '*' is not positioned at length-3 of the
  // trimmed sentence. '$A*41XY' has length 7 (length-3 = 4 = '1'),
  // but split('*') yields ['$A', '41XY'] and parseInt('41XY', 16) = 65,
  // which equals the checksum of '$A' starting at index 1 ('A' = 65).
  // A full split-and-validate would return true, but the positional
  // check on '*' at length-3 must reject the sentence first.
  it('rejects $-prefix + valid split-based checksum when * is not at length-3', function (done) {
    expect(utils.valid('$A*41XY', true)).to.equal(false)
    done()
  })
})
