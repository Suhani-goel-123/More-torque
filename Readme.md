# More Torque API

Welcome to the More Torque API documentation! This API allows you to manage vehicles and organizations for a taxi service company. Below you'll find instructions on how to test the implemented functionalities using Postman.

## Functionalities

### 1. Decode Vehicle VIN

**Endpoint:** `GET /vehicles/decode/:vin`

**Description:** 
This endpoint decodes a vehicle's VIN (Vehicle Identification Number) and retrieves the vehicle's manufacturer, model, and year from the NHTSA API.

**Request Parameters:**
- `vin`: The 17-character VIN of the vehicle to decode.

**Response:**
- **Success (200 OK):** Returns the vehicle's manufacturer, model, and year.
- **Error (400 Bad Request):** Returns an error if the VIN is invalid or not 17 characters long.
- **Error (500 Internal Server Error):** Returns an error if there is a problem with the server or NHTSA API.

**Example Request:**
GET http://localhost:3000/vehicles/decode/5UXWX7C5XBA123456
**example**
```json
{
  "vin": "5UXWX7C5XBA123456",
  "manufacturer": "BMW",
  "model": "X3",
  "year": "2011"
}
```

### 2. Add Vehicle to the System

**Endpoint:** `POST /vehicles`

**Description:**
This endpoint allows you to add a new vehicle to the system. You need to provide a VIN (Vehicle Identification Number) and the organization ID to which this vehicle belongs. The VIN will be decoded to get the vehicle details.

**Request Body:**
```json
{
  "vin": "xxxxxxxxxxxxxxxxx",
  "orgId": "yyyyyyyy"
}
```

similarly moving on to,

### 3. Get Vehicle Details

**Endpoint:** `GET /vehicles/:vin`

**Description:**
This endpoint retrieves details of a vehicle from the system based on the provided VIN. It returns the vehicle details if it exists in the database.

**Path Parameter:**

- `vin` (string): The VIN of the vehicle to fetch. Must be a valid 17-digit alphanumeric string.

**Response:**

- **Success (200 OK):**
```json
  {
    "vin": "xxxxxxxxxxxxxxxxx",
    "manufacturer": "Manufacturer Name",
    "model": "Model",
    "year": "Year",
    "orgId": "yyyyyyyy"
  }
```



**Error (400 Bad Request)**:

```json
Copy code
{
  "error": "Invalid VIN. It must be 17 characters long."
}
Error (404 Not Found):
```

```json
Copy code
{
  "error": "Vehicle not found."
}
```
Testing with Postman:

Set the request method to GET.
Enter the endpoint URL: http://localhost:3000/vehicles/5UXWX7C50BA123456
Send the request.
