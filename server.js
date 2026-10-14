const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const db=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'research_portal_db'
});

db.connect((err) =>{
    if (err) {
        console.error('Database Connection Failed:', err);
        return;
    }
    console.log('Connected to MYSQL Database');
});
app.post('/api/opportunities', (req,res)=>{
    const {title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status} = req.body;
    if (!title || !description || !research_area || !faculty_name || !department || !required_skills || !available_positions || !application_deadline){
        return res.status(400).json({error: 'All required field must be provided'});
    }
    const query= 'INSERT INTO opportunities(title,description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status) VALUES (?,?,?,?,?,?,?,?,?)'; 
    db.query(query,[title,description,research_area,faculty_name,department,required_skills,available_positions,application_deadline,status || 'Open'], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.status(201).json({message: 'Opportunity created Succesfully', id:result.insertId});
        
    });
});
app.get('/api/opportunities', (req, res)=>{
    db.query('SELECT * FROM opportunities', (err,results)=>{
        if(err) return res.status(500).json({error: err.message});
        res.status(200).json(results);
    });
});
app.get('/api/opportunities/:id', (req, res) =>{
    const{id}= req.params;
    db.query('SELECT * FROM opportunities WHERE id=?', [id], (err,results) =>{
        if(err) return res.status(500).json({error: err.message});
        if(results.length ===0) return res.status(404).json({error:'Opportunity not found'});
        res.status(200).json(results[0]);
    });
});
app.put('/api/opportunities/:id', (req,res)=>{
    const {id}=req.params;
    const{title,description,research_area,faculty_name,department, required_skills,available_positions,application_deadline,status} =req.body;
    const query = 'UPDATE opportunities SET title=?,description=?, research_area=?, faculty_name=?, department=?, required_skills=?, available_positions=?, application_deadline=?, status=? WHERE id=?';
    db.query(query, [title,description,research_area,faculty_name,department,required_skills,available_positions,application_deadline,status,id],(err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        if(result.affectedRows === 0) return res.status(404).json({error:'Opportunity not found'});
        res.status(200).json({message: 'Opportunity updated Succesfully'});
    });
});

app.delete('/api/opportunities/:id', (req, res)=>{
    const {id} = req.params;
    db.query('DELETE FROM opportunities WHERE id = ?', [id], (err, result) =>{
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Opportunity not found' });
        res.status(200).json({ message: 'Opportunity deleted successfully' });
    });
});

app.listen(5000,()=>{
    console.log('Server running on http://localhost:5000');
});