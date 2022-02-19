const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const server = require('./server');

const ADDRESS = `${HOST}:${PORT}`;
console.log(ADDRESS)
server.listen(PORT, HOST,  async () => console.log(`Server is live at ${ADDRESS}`));
