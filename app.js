const express = require('express')
const app = express()
app.use(express.json())// lets u read post data in json format
const {Pool} = require('pg')
const pool = new Pool({
    host :'localhost',
    database:'practice',
    user : 'postgres',
    password :'hardik',
    port : 5432
})
app.get('/',(req,res)=> {
    res.json({message:'Hello world', name :'Neha'})
}) 
app.get('/users',async(req,res)=>{
    const result = await pool.query('select * from users')
    res.json(result.rows)
    })
app.post('/users',async(req,res)=>{
    const {name,role }= req.body
    const result = await pool.query('insert into users (name,role) values($1,$2) returning *',[name,role])
    res.json(result.rows[0])
})
app.get('/users/:id',async(req,res)=>{
    const {id}= req.params
    const result = await pool.query('select * from users  where id = $1',[id])
    res.json(result.rows[0])
})
app.listen(3000,()=>{
    console.log('server is running on port 3000 ')
})
//localhost:3000/users
//{"name":"niku",
// "role":"dumb"}