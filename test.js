const assert = require('assert');


const should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:5000/api/v1');


it('confirms that 1 + 1 is 2', () => {
    assert.equal((1 + 1 === 2), true);
});

it('confirms that you can create a vehicle', async () => {
    let categories = ['car', '4 wheeler', 'black vehicles'];

   const res = await api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Hillux',
        colour: 'black',
        year: '2010',
        licenseNumber: 'KJA-56-kyz',
        categories: categories,
    }).expect('Content-type',  /json/).expect(201);

    expect(res.statusCode).to.equal(201);
    expect(res).to.not.equal(undefined);
    expect(res).to.not.equal(null);
    expect(res.body).to.not.equal(undefined);
    expect(res.body).to.not.equal(null);
    expect(res.body.data).to.not.equal(undefined);
    expect(res.body.data).to.not.equal(null);
    expect(res.body.data).to.have.property('name');
    expect(res.body.data.name.toLocaleLowerCase()).to.equal('toyota hillux');
    expect(res.body.data.colour.toLocaleLowerCase()).to.equal('black');
    expect(res.body.data.year.toLocaleLowerCase()).to.equal('2010');
    expect(res.body.data.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');

});


it('confirms that you can retrieve a vehicle by it\'s license plate number', async () => {

    const res = await api.get('/vehicles/KJA-56-kyz').set('Accept', 'application/json')
        .expect('Content-type',  /json/).expect(200);


    expect(res).to.not.equal(undefined);
    expect(res).to.not.equal(null);
    expect(res.body).to.not.equal(undefined);
    expect(res.body).to.not.equal(null);
    expect(res.body).to.have.property('name');
    expect(res.body.data.name.toLocaleLowerCase()).to.equal('toyota hillux');
    expect(res.body.data.colour.toLocaleLowerCase()).to.equal('black');
    expect(res.body.data.year.toLocaleLowerCase()).to.equal('2010');
    expect(res.body.data.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');


});


it('confirms that you can *update* a vehicle by it\'s license plate number', async() => {
    let categories = ['car', '4 wheeler', 'black vehicles'];

    const res = await api.put('/vehicles/KJA-56-kyz').set('Accept', 'application/json').send({
        name: 'Toyota Hillux - updated',
        colour: 'black',
        year: '2010',
        categories: categories,
    }).expect('Content-type',  /json/).expect(200);


    expect(res).to.not.equal(undefined);
    expect(res).to.not.equal(null);
    expect(res.body).to.not.equal(undefined);
    expect(res.body).to.not.equal(null);
    expect(res.body).to.have.property('name');
    expect(res.body.data.name.toLocaleLowerCase()).to.equal('toyota hillux - updated');
    expect(res.body.data.colour.toLocaleLowerCase()).to.equal('black');
    expect(res.body.data.year.toLocaleLowerCase()).to.equal('2010');
    expect(res.body.data.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');


});


it('confirms that the license plate number remains unchanged when you update a vehicle', async () => {

    let categories = ['car', '4 wheeler', 'black vehicles'];
    const res = await api.put('/vehicles/KJA-56-kyz').set('Accept', 'application/json').send({
        name: 'Toyota Hillux - linsr',
        colour: 'black',
        year: '2010',
        licenseNumber: 'kja-changer',
        categories: categories,
    });

    expect(res).to.not.equal(undefined);
    expect(res).to.not.equal(null);
    expect(res.body).to.not.equal(undefined);
    expect(res.body).to.not.equal(null);
    expect(res.body).to.have.property('name');
    expect(res.body.data.name.toLocaleLowerCase()).to.equal('toyota hillux - linsr');
    expect(res.body.data.colour.toLocaleLowerCase()).to.equal('black');
    expect(res.body.data.year.toLocaleLowerCase()).to.equal('2010');
    expect(res.body.data.licenseNumber.toLocaleLowerCase()).to.equal('kja-56-kyz');


});


it('confirms that you are able to delete a vehicle', async () => {
    const res = await api.delete('/vehicles/KJA-56-kyz').set('Accept', 'application/json').expect('Content-type',  /json/).expect(200);
});


it('confirms that you can not create a vechicle with the same license plate number', async () => {
    let categories = ['car', '4 wheeler', 'black vehicles'];

    const res = await api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Hillux',
        colour: 'black',
        year: '2010',
        licenseNumber: 'KJA-56-kyz',
        categories: categories,
    }).expect('Content-type',  /json/).expect(400);

});



it('confirms that you can not create a vehicle that has both car and truck as a category', async () => {
    let categories = ['car', 'truck', '4 wheeler', 'white vehicles'];

    const res = await api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Hillux',
        colour: 'white',
        year: '2014',
        licenseNumber: 'KJA-56-kyz-t',
        categories: categories,
    }).expect('Content-type',  /json/).expect(400);

});

it('confirms that in creating a vechicle,  there must be either a car or truck in the category', async () => {
    let categories = ['4 wheeler', 'white vehicles'];

    const res = await api.post('/vehicles').set('Accept', 'application/json').send({
        name: 'Toyota Corrola',
        colour: 'white',
        year: '2013',
        licenseNumber: 'KJA-56-kyz-tz',
        categories: categories,
    }).expect('Content-type',  /json/).expect(400);

});

