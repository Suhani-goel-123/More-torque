const express = require('express');
const vehicleRoutes = require('./routes/Vroutes');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/vehicles', vehicleRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
