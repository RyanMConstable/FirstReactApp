import './App.css';
import {useState} from "react";
import Axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {


  //for sizer database
  const [site, setSite] = useState();
  const [location, setLocation] = useState();
  const [numofusers, setNumofusers] = useState();
  const [totalamountofdata, setTotalamountofdata] = useState();
  const [estimatedgrowth, setEstimatedgrowth] = useState();
  const [averagefilesize, setAveragefilesize] = useState();
  const [numfiles, setNumfiles] = useState();
  const [customer, setCustomer] = useState();
  const [tempcustomer, setTempCustomer] = useState();


  //List of employees for the print
  const[employeeList, setEmployeeList] = useState([]);

  //Deleting a row in the database table
  const [deleteSite, setDeletesite] = useState();

  //Searching rows in the database table
  ////////////////////////////////////////
  const [searchSite, setSearchSite] = useState();



  //sends information from the front end to the backend
  //After sending the info to the backend it then returns
  //All table data from the backend and displays it nicely
  const addSite = () => {console.log(site);
    //Checks if the variables are empty and displays an alert for now
    //The error message doesn't display exactly what the issue is as of now
    if (site == null ||
        location == null ||
        numofusers == null ||
        totalamountofdata == null ||
        estimatedgrowth == null ||
        averagefilesize == null ||
        numfiles == null ||
        tempcustomer == null){
      return alert("Invalid Input")
    }
    alert("Information has been added to the database!")
    //PT 1 sends information to the backend
    Axios.post('http://localhost:3001/create',
    {site:site,
    location:location,
    numofusers:numofusers,
    totalamountofdata:totalamountofdata,
    estimatedgrowth:estimatedgrowth,
    averagefilesize:averagefilesize,
    numfiles:numfiles,
    tempcustomer:tempcustomer}).then(() => {
      setEmployeeList([
        ...employeeList,
         {site:site,
         location:location,
         numofusers:numofusers,
         totalamountofdata:totalamountofdata,
         estimatedgrowth:estimatedgrowth,
         averagefilesize:averagefilesize,
         numfiles:numfiles, 
         tempcustomer:tempcustomer
         },
       ])
    })
  };

//////////////////////////////////////////////////////////////////////////
  //Delete
  const removeRow = () => {console.log(deleteSite);
    if (deleteSite == null){
      return alert("Invalid Input")
    }
    Axios.post('http://localhost:3001/delete',
  {deleteSite:deleteSite});
  getInfo()
};
/////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////
  //This is a function to get all rows from the database table sizer
  const getInfo = () => {
    Axios.get("http://localhost:3001/getinfo",).then((response) => {
      setEmployeeList(response.data)
    });
  }
////////////////////////////////////////////////////////////////////
  //Function to get the searched for quality 
  const searchItem = () => {console.log(searchSite);
    if (searchSite == null){
      return alert("Must input something")
    }
    Axios.post('http://localhost:3001/search',
  {searchSite:searchSite}).then((response) => {
    if (response.data.length == 0){
      return alert("No rows for customer: " + searchSite + " exist.")
    }
    console.log(response.data)
    setEmployeeList(response.data)
  })
};

/////////////////////////////////////////////////////////////////////////////
  const addCustomer = () => {
    if (customer == null) {
      return alert("Cannot be empty")
    } else {
      Axios.post('http://localhost:3001/addCustomer',
      {customer:customer,})
    }
  }
/////////////////////////////////////////////////////////////////////////////
//Physical display + onchange buttons for the information needed
  return (
    <div className="App">
      <Paper elevation = {10} className = "page">

        <div className = "info">
            <Paper elevation = {10} className = "information">
              <label>Customer</label>
              <TextField type = "text"
              onChange={(event) => {setCustomer(event.target.value)}}/>
              <Button variant="outlined" onClick = {addCustomer}>Add</Button>
            </Paper>
        </div>

        <div className = "information">
          <Paper elevation = {10} className = "information">
            <label>Site</label>
            <TextField type = "number"
            onChange={(event) => {setSite(event.target.value)}}/>
            <label>Location</label>
            <TextField type = "text"
            onChange={(event) => {setLocation(event.target.value)}}/>
            <label>Number of Users</label>
            <TextField type = "number"
            onChange={(event) => {setNumofusers(event.target.value)}}/>
            <label>Total Amount of Data</label>
            <TextField type = "number"
            onChange={(event) => {setTotalamountofdata(event.target.value)}}/>
            <label>Estimated Growth</label>
            <TextField type = "number"
            onChange={(event) => {setEstimatedgrowth(event.target.value)}}/>
            <label>Average File Size</label>
            <TextField type = "number"
            onChange={(event) => {setAveragefilesize(event.target.value)}}/>
            <label>Number of Files</label>
            <TextField type = "number"
            onChange={(event) => {setNumfiles(event.target.value)}}/>
            <label>Customer</label>
            <TextField type = "text"
            onChange={(event) => {setTempCustomer(event.target.value)}}/>
            <div className = 'AddButton'>
              <Button variant="outlined" onClick = {addSite}>Add</Button>
              <Button variant = "outlined">Finalize</Button>
            </div>
          </Paper>

          <div className = "hideAndDelete">
            <div>
              <Paper elevation = {10}className = "delete">
                <TextField type = "number"variant = "outlined"
                onChange={(event) => {setDeletesite(event.target.value)}}/>
                <Button  onClick = {removeRow} variant = "outlined">Delete</Button>
              </Paper>
            </div>

            <div>
              <Paper elevation = {10} className = "tablebutton">
              <TextField variant = "outlined"
                onChange={(event) => {setSearchSite(event.target.value)}}/>
                <Button  onClick = {searchItem} variant = "outlined">Search</Button>
                <Button onClick = {getInfo} variant = "outlined">Show All</Button>
              </Paper>
            </div>
          </div>
        </div>

          
      <div>
        <div className = "info" id = "info">
        <TableContainer component={Paper} elevation = {10} className = "table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Site</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Number of Users</TableCell>
                <TableCell>Total Amount of Data</TableCell>
                <TableCell>Estimated Growth</TableCell>
                <TableCell>Average File Size</TableCell>
                <TableCell>Number of Files</TableCell>
              </TableRow>
            </TableHead>
          {employeeList.map((val,key) => {
            return <TableBody>
              <TableRow>
                <TableCell>{val.site}</TableCell>
                <TableCell>{val.location}</TableCell>
                <TableCell>{val.numofusers}</TableCell>
                <TableCell>{val.totalamountofdata}</TableCell>
                <TableCell>{val.estimatedgrowth}</TableCell>
                <TableCell>{val.averagefilesize}</TableCell>
                <TableCell>{val.numfiles}</TableCell>
              </TableRow>
            </TableBody>
          })}
          </Table>
        </TableContainer>
        </div>
      </div>
    </Paper>
  </div>
  );
}

export default App;
