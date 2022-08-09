const express = require('express');
const app = express();
const mysql = require('mysql2')
const cors = require('cors');
//const { setMaxListeners } = require('mysql2/typings/mysql/lib/Connection');
//const { default: SelectInput } = require('@mui/material/Select/SelectInput');
//const { setMaxListeners } = require('mysql2/typings/mysql/lib/Connection');

app.use(cors())
app.use(express.json());

//setup connection to database
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'Chewey607',
  database: 'examplesystem',
});




/////////////////////////////////////////////////////////////////////////////////////////
//When /create is used this data is created
app.post('/create', (req,res) => {
  //sizer table
  console.log(req.body)
  const site = req.body.site
  const location = req.body.location
  const numofusers = req.body.numofusers
  const totalamountofdata = req.body.totalamountofdata
  const estimatedgrowth = req.body.estimatedgrowth
  const averagefilesize = req.body.averagefilesize
  const numfiles = req.body.numfiles
  const tempcustomer = req.body.tempcustomer
  const freeze = 0

  db.query("SELECT customerid FROM customer WHERE (customerName = ?)", [tempcustomer], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (result[0] != null) {
        let customerid = result[0]['customerid']
      db.query("INSERT INTO quote (site, location, numusers, totaldata, estimatedgrowth, avgfilesize, numfiles, customerid, freeze) VALUES (?,?,?,?,?,?,?,?,?)",
  [site, location, numofusers, totalamountofdata, estimatedgrowth, averagefilesize, numfiles, customerid, freeze]), (err, result) => {
    if (err) {
      console.log(err)
    }
  }
      db.query("SELECT site, location, numusers AS numofusers, totaldata AS totalamountofdata, estimatedgrowth, avgfilesize AS averagefilesize, numfiles FROM quote WHERE (customerid = ?)", [customerid], (err, result) => {
        if (err) {
          console.log(err)
        } else {
          res.send(result)
        }
      })
}} 
  })
});
////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////
//When finalize is used
app.post('/finalize', (req, res) => {
  const bodyCustomer = req.body.customer
  db.query("SELECT customerid FROM customer WHERE (customerName = ?)", [bodyCustomer], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (result[0] != null) {
        let customerid = result[0]['customerid']
        db.query('UPDATE quote SET freeze = 1 WHERE (customerid = ?)', [customerid]), (err, result) => {
          if (err) {
            console.log(err)
          } else {
            console.log('success')
          }
        }
  }
}} 
  )

})




////////////////////////////////////////////////////////////////////////////////////
//When /delete is used
app.post('/delete', (req, res) => {
  const bodySite = req.body.deleteSite

  db.query("DELETE FROM sizer WHERE (site = ?)", [bodySite]), (err,result) => {
    if (err){
      console.log(err)
    } 
  }

  db.query("DELETE FROM qidtab WHERE (site = ?)", [bodySite]), (err,result) => {
    if (err){
      console.log(err)
    } 
  }

  db.query("SELECT * FROM sizer", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    };
  });

});
//////////////////////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////////////////////////////
app.post('/addCustomer', (req,res) => {
  //This function needs to accept multiple requests 
    const customer = req.body.customer
    var customerid = 0
    console.log(req.body.customer)

    //Query to check and see if the name is already in the database 
    db.query("SELECT customerName from customer WHERE (customerName = ?)", [customer], (err, result) => {
      //If the name is not in the database create the new name
      if (result[0] == null){
        //New query to create the customerid for the new customer name
        db.query("SELECT max(customerid) from customer", (err, result) => {
          //if the customerid is not null, then we add a number to the maximum customerid
          if (result[0]['max(customerid)'] != null){
            customerid = result[0]['max(customerid)'] + 1
          }
          //otherwise we add the error to the console
          if (err) {
            console.log(err)
          } else {
            //Otherwise query to insert a new line in the customer table inside the sql table
            db.query('INSERT INTO customer (customerName, customerid) VALUES (?, ?)',
      [customer, customerid]), (err, result) => {
        if (err){
          console.log(err)
        }
      }
          }
        })
      } else {
        //put something here to send back to tell the front end that this already exists within the database
      }
    })
  });
///////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////////////////
//When /search is used
app.post('/search', (req, res) => {
  const bodySite = req.body.searchSite
  //console.log(bodySite)
  db.query("SELECT customerid FROM customer WHERE (customerName = ?)", [bodySite], (err,result) => {
    if (err){
      console.log(err)
    } else if (result[0] != null){
      var newcust = result[0]['customerid']
      db.query("SELECT site, location, numusers AS numofusers, totaldata AS totalamountofdata, estimatedgrowth, avgfilesize AS averagefilesize, numfiles FROM quote WHERE (customerid = ?)", [newcust], (err, result) => {
        if (err) {
          console.log(err)
        } else {
          //console.log(result)
          res.send(result)
        }
      })
    }
  })
});
///////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////////////////////
//Takes every table from the MYSql table
app.get('/getinfo', (req, res) => {
  db.query("SELECT site, location, numusers AS numofusers, totaldata AS totalamountofdata, estimatedgrowth, avgfilesize AS averagefilesize, numfiles FROM quote", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    };
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////

//Lets me know the server is running
app.listen(3001, ()=> {
  console.log("The server is running!")
});
