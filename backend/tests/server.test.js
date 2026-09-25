const test = require('node:test');
const assert = require('node:assert/strict');

const { app } = require('../server');

async function withServer(testFn) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;

  try {
    await testFn(port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test('GET /api/health returns backend status', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://localhost:${port}/api/health`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.status, 'ok');
  });
});

test('POST /api/analyze rejects missing upload', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://localhost:${port}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    assert.equal(response.status, 400);
    const data = await response.json();
    assert.match(data.error, /No file uploaded/i);
  });
});

test('POST /api/analyze rejects unsupported file types', async () => {
  await withServer(async (port) => {
    const formData = new FormData();
    formData.append('document', new Blob(['not a real contract'], { type: 'text/plain' }), 'notes.txt');

    const response = await fetch(`http://localhost:${port}/api/analyze`, {
      method: 'POST',
      body: formData
    });

    assert.equal(response.status, 400);
    const data = await response.json();
    assert.match(data.error, /Only PDF and DOCX files are allowed/i);
  });
});

test('API rate limiter blocks requests after 30 hits in a 15 minute window', async () => {
  await withServer(async (port) => {
    for (let i = 0; i < 30; i += 1) {
      const response = await fetch(`http://localhost:${port}/api/health`);
      assert.ok(response.status === 200 || response.status === 429, `Unexpected status ${response.status}`);
    }

    const response = await fetch(`http://localhost:${port}/api/health`);
    assert.equal(response.status, 429);
  });
});
