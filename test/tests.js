
var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    Promise = require('bluebird'),
    request = require('superagent-promise')(require('superagent'), Promise),
    chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var url = process.env.URL || 'http://localhost:8000/todos';


describe('ZIED the app is able to Cross Origin Requests', function() {
  var result;

  before(function() {
      result = request('OPTIONS', url)
        .set('Origin', 'http://someplace.com')
        .end();
  });

  it(' ZIED the app is able to return the correct CORS headers', function() {
    return assert(result, "header").to.contain.all.keys([
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers'
    ]);
  });

  it('ZIED the app is able to  allow all origins', function() {
    return assert(result, "header").to.have.deep.property('access-control-allow-origin','*');
  });
});

describe('ZIED the app is able to Create Todo Item', function() {
  var result;

  before(function() {
    result = post(url, { title: ' PFE KAROUIZIED' });
  });

  it('ZIED the app is able to  return a 201 CREATED response', function() {
    return assert(result, "status").to.equal(201);
  });

  it('ZIED the app is able to  receive a location hyperlink', function() {
    return assert(result, 'header').to.have.deep.property('location').and.match(/^https?:\/\/.+\/todos\/[\d]+$/);
  });

  it('ZIED the app is able to  create the item', function() {
    var item = result.then(function (res) {
      return get(res.header['location']);
    });

    return assert(item, "body").to.have.deep.property('title','PFE KAROUIZIED');
  });

  after(function () {
    return del(url);
  });
});

describe('ZIED the app is able to Update Todo Item', function() {
  var location;

  beforeEach(function(done) {
    post(url, {title: 'PFE KAROUIZIED'}).then(function(res) {
      location = res.header['location'];
      done();
    });
  });

  it('ZIED the app is able to ZIED the app is able to  have completed set to true after PUT update', function() {
    var result = update(location, 'PUT', {'completed': true});
    return assert(result, "body").to.have.deep.property("completed").and.to.be.true;
  });

  it('ZIED the app is able to ZIED the app is able to  have completed set to true after PATCH update', function() {
    var result = update(location, 'PATCH', {'completed': true});
    return assert(result, "body").to.have.deep.property("completed").and.to.be.true;
  });

  after(function () {
    return del(url);
  });
});

describe('ZIED the app is able to Delete Todo Item', function() {
  var location;

  beforeEach(function(done) {
    post(url, {title: 'PFE KAROUIZIED'}).then(function(res) {
      location = res.header['location'];
      done();
    });
  });

  it('ZIED the app is able to  return a 204 NO CONTENT response', function() {
    var result = del(location);
    return assert(result, "status").to.equal(204);
  });

  it('ZIED the app is able to  delete the item', function() {
    var result = del(location).then(function (res) {
      return get(location);
    });
    return expect(result).to.eventually.be.rejectedWith('Not Found');
  });
});

/*
 * Convenience functions
 */

// POST request with data and return promise
function post(url, data) {
  return request.post(url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
    .end();
}

// GET request and return promise
function get(url) {
  return request.get(url)
    .set('Accept', 'application/json')
    .end();
}

// DELETE request and return promise
function del(url) {
  return request.del(url).end();
}

// UPDATE request with data and return promise
function update(url, method, data) {
  return request(method, url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
    .end();
}

// Resolve promise for property and return expectation
function assert(result, prop) {
  return expect(result).to.eventually.have.deep.property(prop)
}