const request = require('request');
const querystring = require('querystring');


const pynq_ip = '192.168.1.10';


exports.registry_api = function(action, options) {
  options['action'] = action;
  return new Promise((resolve, reject) => {
    request.get(`http://sygnaller.silvestri.io:8000/?` + querystring.encode(options), {
    }, (error, res, body) => {
      if (error) reject(error);
      else resolve(JSON.parse(body));
    });
  });
};


exports.pynq_api = function(action, options) {
  return new Promise((resolve, reject) => {
    request.post(`http://${pynq_ip}:8000/${action}`, {
      json: options
    }, (error, res, body) => {
      if (error) reject(error);
      else resolve(body);
    });
  });
};


exports.compiler_api = function(action, options) {
  return new Promise((resolve, reject) => {
    request.post(`http://sygnaller.silvestri.io:9000/${action}`, {
      json: options
    }, (error, res, body) => {
      if (error) reject(error);
      else resolve(body);
    });
  });
};
