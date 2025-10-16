import request from 'supertest';
import express from 'express';
import competitionsRouter from '../routes/competitions.js';

const app = express();
app.use(express.json());
app.use('/api/competitions', competitionsRouter);

describe('Competitions API', () => {
  it('GET /api/competitions returns array', async () => {
    const res = await request(app).get('/api/competitions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/competitions creates competition', async () => {
    const newComp = {
      name: 'Test Comp',
      category: 'Test',
      start_date: '2025-10-01',
      end_date: '2025-10-31',
      description: 'Test description'
    };
    const res = await request(app).post('/api/competitions').send(newComp);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newComp.name);
  });
});
