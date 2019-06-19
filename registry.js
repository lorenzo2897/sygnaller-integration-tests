const registry_api = require('./index').registry_api;

const mocha = require("mocha");
const describe = mocha.describe;
const chai = require('chai');
const expect = chai.expect;


describe('register_device', function () {

  it('should not return an error', async function () {
    let response = await registry_api('register_device', {"mac": "001100110011", "ip": "1.1.1.1"});
    expect(response).to.be.empty;
  });

  it('should require mac field', async function () {
    let response = await registry_api('register_device', {"ip": "1.1.1.1"});
    expect(response).to.contain.keys('error');
  });

  it('should require ip field', async function () {
    let response = await registry_api('register_device', {"mac": "1.1.1.1"});
    expect(response).to.contain.keys('error');
  });

});



describe('list_devices', function () {

  it('should be an array', async function() {
    let body = await registry_api('list_devices', {});
    expect(body).to.be.a('Array');
  });

  it('should register devices', async function() {
    await registry_api('register_device', {"mac": "001100110011", "ip": "1.1.1.1"});
    let body = (await registry_api('list_devices', {})).filter(value => value.mac === "001100110011");
    expect(body).to.length(1);
    expect(body[0]).to.contain.all.keys('mac', 'ip', 'time');
    expect(body[0].mac).to.equal("001100110011");
    expect(body[0].ip).to.equal("1.1.1.1");
  });

  it('should replace duplicate macs', async function () {
    await registry_api('register_device', {"mac": "001100110011", "ip": "1.1.1.1"});
    let body = (await registry_api('list_devices', {})).filter(value => value.mac === "001100110011");
    expect(body).to.length(1);
    expect(body[0].ip).to.equal("1.1.1.1");
    await registry_api('register_device', {"mac": "001100110011", "ip": "2.1.1.1"});
    body = (await registry_api('list_devices', {})).filter(value => value.mac === "001100110011");
    expect(body).to.length(1);
    expect(body[0].ip).to.equal("2.1.1.1");
  });

});


describe('query_device', function () {

  it('should return an error when not found', async function () {
    let res = await registry_api('query_device', {"mac": "0"});
    expect(res).to.contain.keys('error');
  });

  it('should return a single entry', async function () {
    await registry_api('register_device', {"mac": "001100110011", "ip": "1.1.1.1"});
    let res = await registry_api('query_device', {"mac": "001100110011"});
    expect(res).to.contain.keys('mac', 'ip', 'time');
  });

});
