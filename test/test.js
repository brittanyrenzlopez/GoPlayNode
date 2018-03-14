const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../app');

// use expect syntax
const expect = chai.expect;
// make HTTP requests in tests
chai.use(chaiHttp);


describe('Users', function(){
//activate server before test
	before(function(){
		return runServer();
	});
//close server at end of test
	after(function(){
		return closeServer();
	});
//make request to /users, inspect response
	it('should list users of GET', function() {
		//return promise
		return chai.request(app)
		.get('/users/login')
		.then(function(res){
 		expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        const expectedKeys = ['username', 'password', 'email', 'name'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
				expect(item).to.have.all.keys(expectedKeys);
			});
		})
	});
	//make POST w data for new user, inspect response
	it('should add user on POST', function() {
		const newUser = {email: 'playdomain@gmail.com', name: 'Mark', password: 'music', username: 'player2'};
		return chai.request(app)
		.post('/users/register')
		.send(newUser)
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res.body).to.be.a('object');
			expect(res.body.id).to.not.equal(null);
			expect(res.body).to.deep.equal(Object.assign(newUser));
		});
	});
});