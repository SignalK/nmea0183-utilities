var chai = require("chai");
var expect = chai.expect;
var utils = require('../index');

describe('CheckSum', function () {

    var sentence1 = '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,';
    it('Checksum should be added and equal *6F', function (done) {
        expect(utils.checksummedSentence(sentence1, true)).to.equal('$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F');
        done();
    });

    var sentence2 = '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,';
    it('Checksum should not be added', function (done) {
        expect(utils.checksummedSentence(sentence2, false)).to.equal('$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,');
        done();
    });

    var sentence3 = '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6A';
    it('Checksum should be recalculated to *6F', function (done) {
        expect(utils.checksummedSentence(sentence3, true)).to.equal('$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F');
        done();
    });

    var sentence4 = '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6A';
    it('Checksum should not be recalculated to *6F', function (done) {
        expect(utils.checksummedSentence(sentence4, false)).to.equal('$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6A');
        done();
    });

    var sentence5 = '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6';
    it('Garbage checksum should be recalculated to *6F', function (done) {
        expect(utils.checksummedSentence(sentence5, true)).to.equal('$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F');
        done();
    });

    var sentence6 = '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6';
    it('Garbage checksum should not be recalculated to *6F', function (done) {
        expect(utils.checksummedSentence(sentence6, false)).to.equal('$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6');
        done();
    });

});
