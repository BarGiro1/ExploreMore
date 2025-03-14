beforeAll(done => {
    done()
})  
afterAll(done => {
    done()
}
)
describe('GET / ', () => {
    test("It SHOULD RES HELLO", async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toEqual(200);
    });
});