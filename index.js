const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Mysql Connection
const pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tech_elibrary'
});

app.post('/contact',(req,res) => {

    pool.getConnection((err, connection)=>{
        if(err)throw err
        console.log('connected as id '+ connection.threadId)
        
        const params = req.body

        connection.query('INSERT INTO contact SET ?',params, (err,rows)=>{
            connection.release() //return the connection to pool

            if(!err){
                res.send(params.firstName +' Has been added')
            }
            else{
                console.log(err)
            }
        })
        console.log(req.body)
    })
})
app.get('/contacts',(req,res) => {

    pool.getConnection((err, connection)=>{
        if(err)throw err
        console.log('connected as id' + connection.threadId)

        connection.query('SELECT * from contact', (err,rows)=>{
            connection.release() //return the connection to the pool

            if(!err){
                res.send(rows)
            }

            else{
                console.log(err)
            }
        })
    })
})


app.delete('/:firstName',(req,res)=>{

    pool.getConnection((err, connection)=>{
        if(err)throw err
        console.log('connected as id'+ connection.threadId)

        connection.query('DELETE from contact WHERE firstName = ?',[req.params. firstName], (err,rows)=>{
            connection.release() //return the connection to the pool

            
            if(!err){
                res.send([req.params. firstName]+' Has been deleted')
        }
        else{
            console.log(err)
        }
        
    })
    })
})
app.listen(port, ()=> console.log('Listening on Port '+ port))