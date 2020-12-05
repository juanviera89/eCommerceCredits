// Import the dependencies for testing
/* import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js'; */
const chai = require('chai')
const chaiHttp = require('chai-http')
const rfr = require('rfr')
const app = rfr('/index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

const wait = (done) => {
    setTimeout(() => {
        if (app.getApp('main') != undefined) {
            return done()
        }
        wait(done)
    }, 100);
}

describe('/health', function() {
    before( function(done){
        app.waitForAppReady('main',450).then( ready => {
            if(!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function(){
        it('Should return a text containing "GET"', function(done) {
            chai.request(app.getApp('main'))
            .get('/health')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.a('string');
                const p = res.text.indexOf('GET');
                p.should.not.be.equal(-1);
                
                done();
             });
        })
    })
})