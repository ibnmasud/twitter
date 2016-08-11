var request = require('supertest');
var token 
//require = require('really-need');
describe('loading express', function () {
  var server = require('../server');
  
  it('call login without username or password /users/login', function testSlash(done) {
    request(server)
      .post("/users/login")
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call login without password /users/login', function testSlash(done) {
    request(server)
      .post("/users/login")
      .send({
          username:"abc"
      })
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call login without username /users/login', function testSlash(done) {
    request(server)
      .post("/users/login")
      .send({
          password:"abc"
      })
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call login with wrong password /users/login', function testSlash(done) {
    request(server)
      .post("/users/login")
      .send({
          username:"abc",
          password:"abc"
      })
      .expect('Content-type',/json/)
      .expect(200, {error:"Invalid User"},done);
  });
  it('call login with right password /users/login', function testSlash(done) {
    request(server)
      .post("/users/login")
      .send({
          username:"abc",
          password:"ali"
      })
      .expect(function(res){
          if (!(res.body.token)) throw new Error("missing token");
          token = res.body.token
      })
      .expect('Content-type',/json/)
      .expect(200,done);
  });
  
  it('call register without username or password /users/register', function testSlash(done) {
    request(server)
      .post("/users/register")
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call register without password /users/register', function testSlash(done) {
    request(server)
      .post("/users/register")
      .send({
          username:"abc"
      })
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call register without username /users/register', function testSlash(done) {
    request(server)
      .post("/users/register")
      .send({
          password:"abc"
      })
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call register with existing user /users/register', function testSlash(done) {
    request(server)
      .post("/users/register")
      .send({
          username:"abc",
          password:"abc"
      })
      .expect('Content-type',/json/)
      .expect(200, {error:"Userid is taken"},done);
  });




  it('call follow with user missing /users/follow', function testSlash(done) {
    request(server)
      .post("/users/follow")
      .set("token",token)
      .set("id","abc")
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call follow with user /users/follow', function testSlash(done) {
    request(server)
      .post("/users/follow")
      .set("token",token)
      .set("id","abc")
      .send({
          user:"ali4",
      })
      .expect('Content-type',/json/)
      .expect(200,done);
  });

  it('call unfollow with user missing /users/unfollow', function testSlash(done) {
    request(server)
      .post("/users/unfollow")
      .set("token",token)
      .set("id","abc")
      .expect('Content-type',/json/)
      .expect(200, {error:"Missing required informations"},done);
  });
  it('call unfollow with user /users/unfollow', function testSlash(done) {
    request(server)
      .post("/users/unfollow")
      .set("token",token)
      .set("id","abc")
      .send({
          user:"ali4",
      })
      .expect('Content-type',/json/)
      .expect(200,done);
  });


  it('get users tweets with user /tweets', function testSlash(done) {
    request(server)
      .get("/tweets")
      .set("token",token)
      .set("id","abc")
      .expect('Content-type',/json/)
      .expect(200,done);
  });

  it('get all tweets with user /tweets', function testSlash(done) {
    request(server)
      .get("/tweets?getAll=true")
      .set("token",token)
      .set("id","abc")
      .expect('Content-type',/json/)
      .expect(200,done);
  });

  it('get all tweets with user /tweets', function testSlash(done) {
    request(server)
      .get("/tweets?getAll&page=1")
      .set("token",token)
      .set("id","abc")
      .expect('Content-type',/json/)
      .expect(200,done);
  });
  
  it('get all tweets with user /tweets', function testSlash(done) {
    request(server)
      .get("/tweets?hash=test")
      .set("token",token)
      .set("id","abc")
      .expect('Content-type',/json/)
      .expect(200,done);
  });

  it('get all tweets with user /tweets', function testSlash(done) {
    request(server)
      .get("/tweets?hash=test")
      .set("token","invalid")
      .set("id","abc")
      .expect('Content-type',/json/)
      .expect(200,done);
  });


  it('404 everything else', function testPath(done) {
    console.log('test 404')
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});