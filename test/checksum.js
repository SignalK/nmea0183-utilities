var chai = require("chai");
var expect = chai.expect;
var utils = require('../index');

describe('CheckSum', function () {

    var sentence1 = '$GPBOD,045.,T,023.,M,DEST,START';
    it('Checksum should be added and equal *01', function (done) {
        expect(utils.appendChecksum(sentence1)).to.equal('$GPBOD,045.,T,023.,M,DEST,START*01');
        done();
    });

    var sentence2 = '!GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,';
    it('Checksum should be added and equal *6F', function (done) {
        expect(utils.appendChecksum(sentence2)).to.equal('!GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F');
        done();
    });

    var sentence3 = '#GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,';
    it('Checksum should not be appended', function (done) {
        expect(utils.appendChecksum(sentence3)).to.equal('#GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,');
        done();
    });
 
    var sentence4 = '$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6A';
    it('Checksum should not be recalculated to *6F', function (done) {
        expect(utils.appendChecksum(sentence4)).to.equal('$GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6A');
        done();
    });

    var sentence5 = '$GPBOD,045.,T,023.,M,DEST*,START*';
    it('Checksum should not be appended', function (done) {
        expect(utils.appendChecksum(sentence5)).to.equal('$GPBOD,045.,T,023.,M,DEST*,START*');
        done();
    });

});
