const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid');
app.use(express.static("public"));
//Below lines need to be added to have access to req.body with post request.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', function (req, res) {
  const fileName = 'notes.html';
  const options = {
    root: path.join(__dirname, 'public')
    
    
};
res.sendFile(fileName, options)
})



app.get('/api/notes', function (req, res) {
    
    fs.readFile("./db/db.json", "utf8", function (err, data){
        
        res.json(JSON.parse(data))
    })
    
})

app.post('/api/notes', function (req, res) {
    console.log(req.body)
    //cannot add object to array in file - first get array from the file which ive done already, then add object to array, then rewrite file with new array.
    fs.readFile("./db/db.json", "utf8", function (err, data){
        console.log(data)
        let notes = JSON.parse(data)
        console.log(notes)
        req.body.id = uuid()
        notes.push(req.body)
        
        fs.writeFile("./db/db.json", JSON.stringify(notes),{encoding: "utf8"}, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('note add successfully')
            }
            res.send(req.body)
        } )


        
    })
    
})

app.delete('/api/notes/:id', function (req, res) {
    console.log(req.params.id)
    
    //cannot add object to array in file - first get array from the file which ive done already, then add object to array, then rewrite file with new array.
    fs.readFile("./db/db.json", "utf8", function (err, data){
        
        let notes = JSON.parse(data)
        console.log(notes)
        notes = notes.filter(note => note.id !== req.params.id)
        
        fs.writeFile("./db/db.json", JSON.stringify(notes),{encoding: "utf8"}, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('note add successfully')
            }
            res.send(req.body)
        } )


        
    })
})

app.get('/*', function (req, res) {
    const fileName = 'index.html';
    const options = {
        root: path.join(__dirname, 'public')
    };
    res.sendFile(fileName, options)
})

app.listen(process.env.PORT || 3000)