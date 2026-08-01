const express = require('express')
const app = express()
app.use(express.json())// lets u read post data in json format
const {Pool} = require('pg')
const pool = new Pool({
    host :'localhost',
    database:'practice',
    user : 'postgres',
    password :'yourpassword',
    port : 5432
})
app.get('/',(req,res)=> {
    try{
        res.json({message:'Hello world', name :'Neha'})
    }catch(error){
        res.status(500).json({error:error.message})
    }
    
}) 
app.get('/users',async(req,res)=>{
    try{
    const result = await pool.query('select * from users')
    res.json(result.rows)
    }catch(error){
        res.status(500).json({error:error.message})
    }
})
app.post('/users',async(req,res)=>{
    try{
        const {name,role }= req.body
        const result = await pool.query('insert into users (name,role) values($1,$2) returning *',[name,role])
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({error:error.message})
    }
})
app.get('/users/:id',async(req,res)=>{
    try{
        const {id}= req.params
        const result = await pool.query('select * from users  where id = $1',[id])
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({error:error.message})
    }
})
app.delete('/users/:id',async(req,res)=>{
    try{
        await pool.query('delete from users where id = $1',[req.params.id])
        res.json({message:'users deleted successfully'})
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

app.put('/users/:id', async(req,res)=>{
    try {
        const {name, role} = req.body
        const result = await pool.query('update users set name =$1 ,role =$2 where id = $3 returning *',[name,role,req.params.id])
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({error:error.message})
    }
})
app.listen(3000,()=>{
    console.log('server is running on port 3000 ')
})
//localhost:3000/users
//{"name":"niku",
// "role":"dumb"}