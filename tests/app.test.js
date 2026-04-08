const request = require('supertest');
const app = require('../src/app');

describe('ShopAPI Tests', () => {

  // Health endpoint tests
  describe('GET /health', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // Products endpoint tests
  describe('GET /products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return a single product by id', async () => {
      const res = await request(app).get('/products/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(1);
    });

    it('should return 404 for non-existing product', async () => {
      const res = await request(app).get('/products/999');
      expect(res.statusCode).toBe(404);
    });
  });

  // Post product test
  describe('POST /products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'Monitor', price: 399.99, category: 'Electronics', stock: 25 });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe('Monitor');
    });

    it('should return 400 if required fields missing', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'Incomplete' });
      expect(res.statusCode).toBe(400);
    });
  });

});