const axios = require('axios');
const db = require('../db');

// Base URL template for the NHTSA API
const NHTSA_API_URL_TEMPLATE = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{vin}?format=json';

// In-memory rate limiter for NHTSA API calls (5 requests per minute)
const rateLimiter = {
  lastRequest: 0,
  requestCount: 0,
};

// Decode Vehicle VIN
exports.decodeVehicleVin = async (req, res) => {
  const { vin } = req.params;

  // Validate VIN length
  if (vin.length !== 17) {
    return res.status(400).json({ error: 'Invalid VIN. It must be 17 characters long.' });
  }

  const currentTime = Date.now();
  const timeElapsed = currentTime - rateLimiter.lastRequest;

  // Reset rate limiter if more than a minute has passed
  if (timeElapsed > 60000) {
    rateLimiter.lastRequest = currentTime;
    rateLimiter.requestCount = 0;
  }

  if (rateLimiter.requestCount >= 5) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  try {
    // Decode VIN using NHTSA API
    const apiUrl = NHTSA_API_URL_TEMPLATE.replace('{vin}', vin);
    const response = await axios.get(apiUrl);
    const data = response.data.Results;

    // Extract required details from the response
    const manufacturer = data.find((item) => item.Variable === 'Manufacturer Name')?.Value || 'Unknown';
    const model = data.find((item) => item.Variable === 'Model')?.Value || 'Unknown';
    const year = data.find((item) => item.Variable === 'Model Year')?.Value || 'Unknown';

    const vehicle = { vin, manufacturer, model, year };

    // Increment request count and store request time
    rateLimiter.requestCount += 1;

    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error decoding VIN:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add Vehicle
exports.addVehicle = (req, res) => {
  const { vin, orgId } = req.body;

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'Invalid VIN. It must be 17 characters long.' });
  }

  if (!orgId) {
    return res.status(400).json({ error: 'Organization ID is required.' });
  }

  // Check if orgId exists
  db.query('SELECT * FROM orgs WHERE id = ?', [orgId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).json({ error: 'Organization ID not found.' });
    }

    // Check if VIN is already in the database
    db.query('SELECT * FROM vehicles WHERE vin = ?', [vin], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        return res.status(400).json({ error: 'Vehicle with this VIN already exists.' });
      }

      // Add vehicle to the database
      db.query('INSERT INTO vehicles (vin, org_id) VALUES (?, ?)', [vin, orgId], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Vehicle added successfully.' });
      });
    });
  });
};

// Get Vehicle Details
exports.getVehicleDetails = (req, res) => {
  const { vin } = req.params;

  // Validate VIN length
  if (vin.length !== 17) {
    return res.status(400).json({ error: 'Invalid VIN. It must be 17 characters long.' });
  }

  // Query the database for the vehicle with the given VIN
  db.query('SELECT * FROM vehicles WHERE vin = ?', [vin], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.status(200).json(results[0]);
  });
};

exports.createOrganization = (req, res) => {
    const { name, account, website, fuelReimbursementPolicy, speedLimitPolicy } = req.body;
  
    // Validate input
    if (!name || !account || !website) {
      return res.status(400).json({ error: 'Name, account, and website are required.' });
    }
  
    // Set default values if not provided
    const reimbursementPolicy = fuelReimbursementPolicy !== undefined ? fuelReimbursementPolicy : 1000;
    const speedLimit = speedLimitPolicy !== undefined ? speedLimitPolicy : 25;
  
    // Insert new organization into the database
    db.query(
      'INSERT INTO orgs (name, account, website, fuel_reimbursement_policy, speed_limit_policy) VALUES (?, ?, ?, ?, ?)',
      [name, account, website, reimbursementPolicy, speedLimit],
      (err, result) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        // Return the created organization’s details
        res.status(201).json({
          id: result.insertId,
          name,
          account,
          website,
          fuelReimbursementPolicy: reimbursementPolicy,
          speedLimitPolicy: speedLimit,
        });
      }
    );
  };