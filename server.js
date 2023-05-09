const app = require('./app/app');

const PORT = process.env.PORT || 5050;
app.listen(PORT, ()=> {
    console.log(`your application is connected to port ${PORT}`)
})