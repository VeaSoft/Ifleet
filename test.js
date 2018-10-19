const assert = require('assert');


const should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:5000');


it('confirms that 1 + 1 is 2', () => {
    assert.equal((1 + 1 === 2), true);
});

it('confirms that you can create a vehicle', () => {
    let categories = ['car', '4 wheeler', 'black vehicles'];

    api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Hillux',
        colour: 'black',
        year: '2010',
        licenseNumber: 'KJA-56-kyz',
        categories: categories,
    }).expect('Content-type',  /json/).expect(201)
        .end((err, res) => {
            expect(res).to.not.equal(undefined);
            expect(res).to.not.equal(null);
            expect(res.body).to.not.equal(undefined);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.have.property('name');
            expect(res.body.name.toLocaleLowerCase()).to.equal('toyota hillux');
            expect(res.body.colour.toLocaleLowerCase()).to.equal('black');
            expect(res.body.year.toLocaleLowerCase()).to.equal('2010');
            expect(res.body.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');
            done();
        });


});


it('confirms that you can retrieve a vehicle by it\'s license plate number', () => {


    api.get('/vehicles/KJA-56-kyz').set('Accept', 'application/json').send({
        name: 'Toyota Hillux',
        colour: 'black',
        year: '2010',
        licenseNumber: 'KJA-56-kyz',
        categories: categories,
    }).expect('Content-type',  /json/).expect(200)
        .end((err, res) => {
            expect(res).to.not.equal(undefined);
            expect(res).to.not.equal(null);
            expect(res.body).to.not.equal(undefined);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.have.property('name');
            expect(res.body.name.toLocaleLowerCase()).to.equal('toyota hillux');
            expect(res.body.colour.toLocaleLowerCase()).to.equal('black');
            expect(res.body.year.toLocaleLowerCase()).to.equal('2010');
            expect(res.body.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');
            done();
        });


});


it('confirms that you can *update* a vehicle by it\'s license plate number', () => {


    api.put('/vehicles/KJA-56-kyz').set('Accept', 'application/json').send({
        name: 'Toyota Hillux - updated',
        colour: 'black',
        year: '2010',
        categories: categories,
    }).expect('Content-type',  /json/).expect(200)
        .end((err, res) => {
            expect(res).to.not.equal(undefined);
            expect(res).to.not.equal(null);
            expect(res.body).to.not.equal(undefined);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.have.property('name');
            expect(res.body.name.toLocaleLowerCase()).to.equal('toyota hillux - updated');
            expect(res.body.colour.toLocaleLowerCase()).to.equal('black');
            expect(res.body.year.toLocaleLowerCase()).to.equal('2010');
            expect(res.body.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');
            done();
        });


});


it('confirms that the license plate number remains unchanged when you update a vehicle', () => {


    api.put('/vehicles/KJA-56-kyz').set('Accept', 'application/json').send({
        name: 'Toyota Hillux - linsr',
        colour: 'black',
        year: '2010',
        licenseNumber: 'kja-changer',
        categories: categories,
    }).expect('Content-type',  /json/).expect(200)
        .end((err, res) => {
            expect(res).to.not.equal(undefined);
            expect(res).to.not.equal(null);
            expect(res.body).to.not.equal(undefined);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.have.property('name');
            expect(res.body.name.toLocaleLowerCase()).to.equal('toyota hillux - linsr');
            expect(res.body.colour.toLocaleLowerCase()).to.equal('black');
            expect(res.body.year.toLocaleLowerCase()).to.equal('2010');
            expect(res.body.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');
            done();
        });


});


it('confirms that you are able to delete a vehicle', () => {


    api.delete('/vehicles/KJA-56-kyz').set('Accept', 'application/json').expect('Content-type',  /json/).expect(200)
        .end((err, res) => {

        });


});


it('confirms that you can not create a vechicle with the same license plate number', () => {
    let categories = ['car', '4 wheeler', 'black vehicles'];

    api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Hillux',
        colour: 'black',
        year: '2010',
        licenseNumber: 'KJA-56-kyz',
        categories: categories,
    }).expect('Content-type',  /json/).expect(400)
        .end((err, res) => {

        });
});



it('confirms that you can not create a vehicle that has both car and truck as a category', () => {
    let categories = ['car', 'truck', '4 wheeler', 'white vehicles'];

    api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Hillux',
        colour: 'white',
        year: '2014',
        licenseNumber: 'KJA-56-kyz-t',
        categories: categories,
    }).expect('Content-type',  /json/).expect(400)
        .end((err, res) => {

        });
});

it('confirms that in creating a vechicle,  there must be either a car or truck in the category', () => {
    let categories = ['4 wheeler', 'white vehicles'];

    api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Corrola',
        colour: 'white',
        year: '2013',
        licenseNumber: 'KJA-56-kyz-tz',
        categories: categories,
    }).expect('Content-type',  /json/).expect(400)
        .end((err, res) => {

        });
});

