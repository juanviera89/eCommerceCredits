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
let user, client, store,credit, basic, bearer;

describe('/credits', function () {
    before(function (done) {
        app.waitForAppReady('main', 1000).then(async ready => {
            if (!ready) {
                throw new Error('App server ready timeout');
            }
            user = await models.user.create({ email: 'test3@user.cl', password: md5('password') }, { returning: ['id'] });
            basic = `Basic ${Buffer.from('test3@user.cl' + ':' + 'password').toString('base64')}`;
            client = await models.client.create({ email: 'test3@client.cl', name: 'Test Client 3' }, { returning: ['id','email'] });
            store = await models.store.create({ name: 'Store3', clientId: client.id }, { returning: ['id', 'name'] });
            credit = await models.credit.create({ storeId: store.id, credits: 10 + Math.ceil(Math.random() * 9999999) }, { returning: ['id', 'credits'] });
            done()
        })
    })
    describe('GET', function () {
        before(function (done) {
            chai.request(app.getApp('main'))
            .get('/auth').set('Authorization', basic)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    const body = response.body
                    bearer = `Bearer ${body.authToken}`;
                    done();
                });

        })
        it('Should return a json object with error message and status 400 on client param malformation', function (done) {
            chai.request(app.getApp('main'))
                .get(`/credits?client=NoEmail&store=SomeStore`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with error message on no client/store combination found and status 404', function (done) {
            chai.request(app.getApp('main'))
                .get(`/credits?client=noclient@email.cl&store=SomeStore`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')

                    done();
                });
        })
        it('Should return a json object with store`s credits and status 200', function (done) {
            chai.request(app.getApp('main'))
                .get(`/credits?client=${client.email}&store=${store.name}`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.credits.should.be.a('number')
                    done();
                });
        })
    })
    
    describe('POST', function () {
        before(function (done) {
            chai.request(app.getApp('main'))
            .get('/auth').set('Authorization', basic)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    const body = response.body
                    bearer = `Bearer ${body.authToken}`;
                    done();
                });

        })
        it('Should return a json object with error message and status 400 on client param malformation', function (done) {
            chai.request(app.getApp('main'))
                .post(`/credits?client=NoEmail`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with error message on no client/store combination found and status 404', function (done) {
            chai.request(app.getApp('main'))
                .post(`/credits?client=noclient@email.cl&store=SomeStore&amount=5`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')

                    done();
                });
        })
        it('Should return a json object with store`s credits and status 200 ', function (done) {
            chai.request(app.getApp('main'))
                .post(`/credits?client=${client.email}&store=${store.name}&amount=5`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.credits.should.be.a('number')
                    body.credits.should.gt(Number(credit.credits))
                    done();
                });
        })
    })
    
    describe('DELETE', function () {
        before(function (done) {
            chai.request(app.getApp('main'))
            .get('/auth').set('Authorization', basic)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    const body = response.body
                    bearer = `Bearer ${body.authToken}`;
                    done();
                });

        })
        it('Should return a json object with error message and status 400 on client param malformation', function (done) {
            chai.request(app.getApp('main'))
                .delete(`/credits?client=NoEmail`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with error message on no client/store combination found and status 404', function (done) {
            chai.request(app.getApp('main'))
                .delete(`/credits?client=noclient@email.cl&store=SomeStore&amount=7`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')

                    done();
                });
        })
        it('Should return a json object with store`s credits and status 200 ', function (done) {
            chai.request(app.getApp('main'))
                .delete(`/credits?client=${client.email}&store=${store.name}&amount=7`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.credits.should.be.a('number')
                    body.credits.should.lt(Number(credit.credits))
                    done();
                });
        })
        it('Should return a json object with insuficient funds message and status 409', function (done) {
            chai.request(app.getApp('main'))
                .delete(`/credits?client=${client.email}&store=${store.name}&amount=${Number(credit.credits) + 100}`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
    })
    
    after(async function () {
        await models.access_token.destroy({ where: { userId: user.id } })
        await models.transaction.destroy({ where: { userId: user.id } })
        await models.user.destroy({ where: { id: user.id } })
        await models.credit.destroy({ where: { storeId: store.id } })
        await models.store.destroy({ where: { id: store.id } })
        await models.client.destroy({ where: { id: client.id } })
    })

})