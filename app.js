import express from "express"
const PORT = process.env.PORT;

const app = express();

app.get('/api', (req, res) => {
    res.send('Server is Up')
});

app.listen(PORT, () =>{
    console.log(`Server is live on port ${PORT}`);
})