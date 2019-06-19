const compiler_api = require('./index').compiler_api;

const mocha = require("mocha");
const describe = mocha.describe;
const chai = require('chai');
const expect = chai.expect;

/* ************************ Sample hardware code ************************ */

sources = {
  "adder": `
module hello(input [31:0] a, input [31:0] b, output [31:0] c);
    assign c = a + b;
endmodule


module adder(input [31:0] op1, input [31:0] op2, output [31:0] result);
    hello H1(a, b, c);
endmodule
`,
  "counter": `

module mycounter(
input wire clk,
input wire [31:0] set,
output reg [31:0] count
);

always @(posedge clk)
begin
if ( set == 0 )
begin
    count <= count + 1;
end
else
begin
count <= set;
end
end

endmodule
`
};

components = [
  {
    "name": "mycounter",
    "ports": [
      {"name": "test", "type": "clock"},
      {"name": "clk", "type": "clock"}
    ]
  },
  {
    "name": "adder",
    "ports": []
  }
];

/* ********************** End sample hardware code ********************** */


describe('no command', function () {

  it('should return an error', async function () {
    let res = await compiler_api('', {});
    expect(res).to.contain.keys('error');
  });

});



describe('echo', function () {

  it('should echo the input', async function () {
    let res = await compiler_api('echo', {"hello": "goodbye"});
    expect(res).to.deep.equal({"hello": "goodbye"});
  });

});



describe('clear_cache', function () {

  it('should not fail', async function () {
    let res = await compiler_api('clear_cache', {"project_id": "_test_dummy"});
    expect(res).to.be.empty;
  });

  it('should fail if missing project id', async function () {
    let res = await compiler_api('clear_cache', {});
    expect(res).to.contain.keys('error');
  });

});



describe('compile', function () {

  it('should fail without a project id', async function () {
    let res = await compiler_api('compile', {"sources": ""});
    expect(res).to.contain.keys('error');
  });

  it('should fail if missing sources', async function () {
    let res = await compiler_api('compile', {"project_id": "_test_dummy"});
    expect(res).to.contain.keys('error');
  });

  it('should start without errors', async function () {
    let res = await compiler_api('compile', {
      project_id: "_test_dummy",
      sources: sources,
      components: components
    });
    expect(res).to.be.empty;
  });

});


describe('build_progress', function () {

  it('should fail without a project id', async function () {
    let res = await compiler_api('build_progress', {});
    expect(res).to.contain.keys('error');
  });

  it('should return not running on fake projects', async function () {
    let res = await compiler_api('build_progress', {project_id: "_fake_test_dummy"});
    expect(res).to.contain.keys('running');
    expect(res["running"]).to.be.false;
  });

  it('should return running on the test dummy', async function () {
    let res = await compiler_api('build_progress', {project_id: "_test_dummy"});
    expect(res).to.contain.keys('running');
    expect(res["running"]).to.be.true;
  });

});

describe('cancel_build', function () {

  it('should fail without a project id', async function () {
    let res = await compiler_api('cancel_build', {});
    expect(res).to.contain.keys('error');
  });

  it('should return an empty result', async function () {
    let res = await compiler_api('cancel_build', {project_id: "_test_dummy"});
    expect(res).to.be.empty;
  });

});
