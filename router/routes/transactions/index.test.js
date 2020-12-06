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
let user, client, store, basic, bearer;

describe('/transactions', function () {
    before(function (done) {
        app.waitForAppReady('main', 1000).then(async ready => {
            if (!ready) {
                throw new Error('App server ready timeout');
            }
            user = await models.user.create({ email: 'test2@user.cl', password: md5('password') }, { returning: ['id'] });
            basic = `Basic ${Buffer.from('test2@user.cl' + ':' + 'password').toString('base64')}`;
            client = await models.client.create({ email: 'test2@client.cl', name: 'Test Client' }, { returning: ['id'] });
            store = await models.store.create({ name: 'Store', clientId: client.id }, { returning: ['id'] });
            await models.transaction.create({ type: 1, amount: Math.ceil(Math.random() * 999999), userId: user.id, storeId: store.id },{ returning: ['id']  }) 
            await models.transaction.create({ type: 1, amount: Math.ceil(Math.random() * 999999), userId: user.id, storeId: store.id },{ returning: ['id']  }) 
            await models.transaction.create({ type: 1, amount: Math.ceil(Math.random() * 999999), userId: user.id, storeId: store.id },{ returning: ['id']  }) 
            await models.transaction.create({ type: 1, amount: Math.ceil(Math.random() * 999999), userId: user.id, storeId: store.id },{ returning: ['id']  }) 
            await models.transaction.create({ type: 1, amount: Math.ceil(Math.random() * 999999), userId: user.id, storeId: store.id },{ returning: ['id']  }) 
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
        it('Should return a json object with error message and status 400 on user param malformation', function (done) {
            chai.request(app.getApp('main'))
                .get(`/transactions?user=NoEmail`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with transactions list and status 200', function (done) {
            chai.request(app.getApp('main'))
                .get('/transactions').set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.history.should.be.an('array')
                    body.history.length.should.not.equal(0)

                    done();
                });
        })
        it('Should return a json object with transactions list and status 200 limited by user', function (done) {
            chai.request(app.getApp('main'))
                .get(`/transactions?user=${encodeURIComponent(user.email)}`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.history.should.be.an('array')
                    body.history.length.should.not.equal(0)
                    done();
                });
        })
        it('Should return a json object with transactions list and status 200 limited by store', function (done) {
            chai.request(app.getApp('main'))
                .get(`/transactions?store=${encodeURIComponent(store.name)}`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.history.should.be.an('array')
                    body.history.length.should.not.equal(0)
                    done();
                });
        })
        it('Should return a json object with empty list and status 200 on user with no transaction param', function (done) {
            chai.request(app.getApp('main'))
                .get(`/transactions?user=EmptyUser@mail.cl`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.history.should.be.an('array')
                    body.history.length.should.equal(0)
                    done();
                });
        })
        it('Should return a json object with empty list and status 200 on store with no transaction param', function (done) {
            chai.request(app.getApp('main'))
                .get(`/transactions?store=EmptyStore`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.history.should.be.an('array')
                    body.history.length.should.equal(0)
                    done();
                });
        })
        it('Should return a json object with empty list and status 200 on store and user combination with no transactions', function (done) {
            chai.request(app.getApp('main'))
                .get(`/transactions?user=${encodeURIComponent(user.email)}&store=EmptyStore`).set('Authorization', bearer)
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.history.should.be.an('array')
                    body.history.length.should.equal(0)
                    done();
                });
        })
    })
    after(async function () {
        await models.access_token.destroy({ where: { userId: user.id } })
        await models.transaction.destroy({ where: { userId: user.id } })
        await models.user.destroy({ where: { id: user.id } })
        await models.store.destroy({ where: { id: store.id } })
        await models.client.destroy({ where: { id: client.id } })
    })

})