const chai = require('chai')
const chaiHttp = require('chai-http')
const rfr = require('rfr')
const app = rfr('/index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();
const should = chai.should();

const models = rfr('db/models').models;
const md5 = require('md5');

describe('/auth', function () {
    before(function (done) {
        app.waitForAppReady('main', 1000).then(ready => {
            if (!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function () {


        before(async function () {
            
            await models.user.create({ email: 'test@user.cl', password: md5('password') }, { returning: ['id'] })
        })
        it('Should return a json object with error message and status 400', function (done) {
            chai.request(app.getApp('main'))
                .get('/auth')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with no authorization message and status 403', function (done) {
            chai.request(app.getApp('main'))
                .get('/auth').set('Authorization', `Basic ${Buffer.from('test@user.cl' + ':' + 'Badpassword').toString('base64')}`)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(403);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with Authorization success message and authorization token', function (done) {
            chai.request(app.getApp('main'))
            .get('/auth').set('Authorization', `Basic ${Buffer.from('test@user.cl' + ':' + 'password').toString('base64')}`)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.authToken.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with error message on token malformation', function (done) {
            chai.request(app.getApp('main'))
            .get('/auth').set('Authorization', `NOBasicTOKEN ${Buffer.from('test@user.cl' + ':' + 'password').toString('base64')}`)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(500);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
        after(async function () {
            const testUser = await models.user.findOne({where : { email: 'test@user.cl', password: md5('password') }})
            await models.access_token.destroy({ where : { userId: testUser.id }})
            await models.user.destroy({ where : { email: 'test@user.cl' }})
        })
    })
})