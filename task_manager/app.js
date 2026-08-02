const express = require('express')
const { Pool } = require('pg')
const app = express()
app.use(express.json())

const pool= new Pool({
    host : "localhost",
    database:"task_manager",
    user:"postgres",
    password : "hardik",
    port:5432
})

app.get("/task",async(req , res )=>{
    try{
        const result =  await pool.query('select * from tasks')
        res.json(result.rows)
    }catch(error){
        res.status(500).json({error:error.message})
        
    }})
app.get("/task/:id",async(req , res )=>{
    try{
        const {id} = req.params
        const result =  await pool.query('select * from tasks where id = $1',[id])
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({error:error.message})
        
    }})
app.post("/task",async(req , res)=>{
    try{
        const {title, status}= req.body
        const existing= await pool.query('select * from tasks where title =$1',[title])
        if (existing.rows.length >0){
            return res.status(400).json({error:'task alredy exists'})
        }
        const result = await pool.query('insert into tasks (title,status)  values( $1 ,$2) returning *',[title,status])
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({error:error.message})
    }
    
})

app.put("/task/:id", async(req,res)=>
{
    try{
        const {id}= req.params
        const {title,status}= req.body
        const result = await pool.query('update tasks set title=$1, status=$2 where id=$3 returning *',[title,status,req.params.id])
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

app.delete("/task/:id",async(req,res)=>{
    try{
        const {id}=req.params
        const result = await pool.query('delete  from tasks where id =$1',[req.params.id])
        res.json({message:'users deleted successfully'})
    }catch(error){
        res.status(500).json({error:error.message})
    }
}
)

app.listen(3000,()=>{
    console.log('server is running on port 3000 ')
})