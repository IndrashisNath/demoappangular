const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const alert = require('alert');

const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req, res) {
	res.send('Hello from server');
});

/* If file exists, read the file and send the value in response */
app.get('/fetch', function(req, res) {
  if (fs.existsSync('test.txt')) {
    fs.readFile('test.txt', 'utf8', (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
      }
      res.send(jsonString);
    });
  }
});

/* search operation */
app.post('/search', function(req, res) {
  let str = req.body.searchq.toLowerCase();
  let arr = [];
  let fileCont = fs.readFileSync('test.txt');
  arr = JSON.parse(fileCont);
  let result = arr.filter(obj => {
    if (obj["firstName"].toLowerCase().includes(str) || obj["lastName"].toLowerCase().includes(str))
      return obj;
    else
      return null;  
  });
  if (result !== null)
    res.send(JSON.stringify(result));
  else
    res.status(200).send({"message": "No value match"});  
});

/* check for redundancy and register */
app.post('/register', function(req, res) {
  let reqObj = req.body;
  let arr = [];
  let newId = 1;
  let result = false;

  if (fs.existsSync('test.txt')) {
    let fileCont = fs.readFileSync('test.txt');
    arr = JSON.parse(fileCont);
    result = arr.some(obj => {
      return (obj["firstName"] === reqObj["firstName"] &&
      obj["lastName"] === reqObj["lastName"]
      );
    });
  }
  if(result)
    alert("Contact already exists!");
  else {
    if (arr.length > 0) {
      arr.sort((a,b) => a.id - b.id);
      newId = arr[arr.length - 1].id + 1;
    }
    arr.push(req.body);
    arr[arr.length - 1].id = newId;
    fs.writeFile("test.txt", JSON.stringify(arr, null, 2), function(err) {
      console.log('File successfully written to disk');
      if (err) {
        console.log(err);
      }
    });
  }  
  res.status(200).send({"message": "Data received"});
});

/* delete operation */
app.post('/delete', function(req, res) {
  let reqId = req.body.id;
  let arr = [];
  let fileCont = fs.readFileSync('test.txt');
  arr = JSON.parse(fileCont);
  arr = arr.filter(obj => {
    return (obj["id"] !== reqId)
  });
  fs.writeFile("test.txt", JSON.stringify(arr, null, 2), function(err) {
    console.log('File successfully written to disk');
    if (err) {
      console.log(err);
    }
  });

  res.status(200).send({"message": "Item was deleted"});
});

/* update operation */
app.post('/update', function(req, res) {
  let reqObjId = req.body.id;
  let arr = [];
  let fileCont = fs.readFileSync('test.txt');
  arr = JSON.parse(fileCont);
  arr = arr.filter(obj => {
    return (obj["id"] !== reqObjId)
  });
  arr.push(req.body);

  fs.writeFile("test.txt", JSON.stringify(arr, null, 2), function(err) {
    console.log('File successfully written to disk');
    if (err) {
      console.log(err);
    }
  });

  res.status(200).send({"message": "Item was updated"});
});

app.listen(PORT, function() {
  console.log("Server running on localhost:" + PORT);
});