"use strict";
const app = require('./server');
const port = process.env.PORT;
app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
