const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/api_route');
const app = express();
const PORT = process.env.PORT || 8004;

app.use(bodyParser.json()); 

app.use('/api', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});