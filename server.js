const app = require('./app/app');

const PORT = process.env.PORT || PORT;
app.listen(PORT, ()=> {
    console.log(`your application is connected to port ${PORT}`)
})