const request = require('supertest');
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API OK' });
});

describe('GET /health', () => {
  it('should return API OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('API OK');
  });
});
