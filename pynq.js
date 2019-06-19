const pynq_api = require('./index').pynq_api;

const mocha = require("mocha");
const describe = mocha.describe;
const chai = require('chai');
const expect = chai.expect;


describe('no command', function () {

  it('should return an error', async function () {
    let res = await pynq_api('', {});
    expect(res).to.contain.keys('error');
  });

});


describe('echo', function () {

  it('should echo the input', async function () {
    let res = await pynq_api('echo', {"hello": "goodbye"});
    expect(res).to.deep.equal({"hello": "goodbye"});
  });

});


describe('ping', function () {

  it('should give a reply', async function () {
    let res = await pynq_api('ping', {});
    expect(res).to.contain.keys('ping');
  });

  it('should contain the mac address', async function () {
    let res = await pynq_api('ping', {});
    expect(res).to.contain.keys('mac');
    expect(res["mac"]).to.match(/[0-9a-fA-F]{12}/);
  });

  it('should contain a running flag', async function () {
    let res = await pynq_api('ping', {});
    expect(res).to.contain.keys('running');
  });

});
