const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

async function runTests() {
  console.log("==================================================");
  console.log("===   RUNNING ENTERPRISE ERP END-TO-END TESTS  ===");
  console.log("==================================================");

  // Require Express app from server
  const express = require('express');
  const cors = require('cors');
  const { connectDB, getDbStatus } = require('./server/config/db');
  const apiRoutes = require('./server/routes/api');

  const app = express();
  const PORT = 5001; // Use test port to avoid conflict

  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRoutes);

  const clientDist = path.join(__dirname, 'client', 'dist');
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });

  console.log("\n[1/3] Connecting to MongoDB Atlas Cluster...");
  await connectDB();

  const server = app.listen(PORT, async () => {
    console.log(`✓ Test Server listening on http://localhost:${PORT}`);
    console.log("\n[2/3] Performing API & Frontend Endpoint Checks...");

    const endpoints = [
      { path: '/', name: 'Frontend SPA HTML Shell', isHtml: true },
      { path: '/api/system/status', name: 'Database Status API' },
      { path: '/api/global/machines', name: 'Global Machinery Master API' },
      { path: '/api/global/clients', name: 'Global Apparel Clients API' },
      { path: '/api/global/sales', name: 'Global Sales Ledger API' },
      { path: '/api/global/china-shipments', name: 'China Import Shipments API' },
      { path: '/api/local/customers', name: 'Local Customer Fleet Directory API' },
      { path: '/api/local/machines', name: 'Local Yard Machinery Master API' },
      { path: '/api/local/payments', name: 'Local Rental Payments Ledger API' },
      { path: '/api/local/config', name: 'Local Company Settings & Config API' }
    ];

    let passed = 0;
    let failed = 0;

    for (const ep of endpoints) {
      try {
        const res = await fetch(`http://localhost:${PORT}${ep.path}`);
        if (!res.ok) {
          console.error(`✗ [FAIL] ${ep.name} (${ep.path}) returned HTTP ${res.status}`);
          failed++;
          continue;
        }

        if (ep.isHtml) {
          const text = await res.text();
          if (text.includes('<div id="root">') && text.includes('ENTERPRISES ERP SOLUTIONS')) {
            console.log(`✓ [PASS] ${ep.name.padEnd(40)} -> HTTP ${res.status} [SPA Root Validated]`);
            passed++;
          } else {
            console.error(`✗ [FAIL] ${ep.name} missing expected root container`);
            failed++;
          }
        } else {
          const json = await res.json();
          let countInfo = '';
          if (Array.isArray(json.data)) {
            countInfo = `(${json.data.length} records)`;
          } else if (json.data && typeof json.data === 'object') {
            countInfo = `(object payload)`;
          }
          console.log(`✓ [PASS] ${ep.name.padEnd(40)} -> HTTP ${res.status} ${countInfo}`);
          passed++;
        }
      } catch (err) {
        console.error(`✗ [FAIL] ${ep.name} error: ${err.message}`);
        failed++;
      }
    }

    console.log("\n[3/3] Test Summary:");
    console.log(`   - Total Passed : ${passed}/${endpoints.length}`);
    console.log(`   - Total Failed : ${failed}/${endpoints.length}`);

    server.close(async () => {
      await mongoose.disconnect();
      if (failed === 0) {
        console.log("\n>>> ALL TESTS PASSED PERFECTLY! System is 100% demo-ready. <<<\n");
        process.exit(0);
      } else {
        console.error("\n>>> SOME TESTS FAILED <<<\n");
        process.exit(1);
      }
    });
  });
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
