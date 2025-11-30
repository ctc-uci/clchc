import express from 'express';
import { db } from '@/db/db-pgp';

const router = express.Router();

// Create a new user
router.post('/',async(req,res) =>{
    try {
        const { email, firebase_uid } = req.body;
        
        const user = await db.query(
        'INSERT INTO users (email, firebase_uid) VALUES ($1, $2) RETURNING *',
        [email, firebase_uid]
        );
        
        res.status(201).json(user);
  } catch (err) {
        res.status(500).send(err.message);
  }
})
// Get all users
router.get('/', async(req,res)=>{
    try{
        const user = await db.query('SELECT * from users');
        res.status(200).json(user);
    } catch(err){
        res.status(500).send(err.message);
    }
})
// Get a user by ID
router.get('/:id', async(req,res)=>{
    try{
        const {id} = req.params

        const user = await db.query('SELECT * from users WHERE id=$1',[id]);
        res.status(200).json(user);
    } catch(err){
        res.status(500).send(err.message);
    }
});
// Update a user by ID
router.put('/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const { email, firebase_uid } = req.body;
        
        const user = await db.query(
        'UPDATE users SET email=$1, firebase_uid=$2 WHERE id=$3 RETURNING *',
        [email, firebase_uid, id]
        );
        
        res.status(200).json(user);
    } catch(err){
        res.status(500).send(err.message); 
    }
});
// Delete a user by ID
router.delete('/:id', async(req,res)=>{
    try{
        const {id} = req.params;

        const user = await db.query('DELETE FROM users WHERE id=$1 RETURNING *',[id]);
        res.status(200).json(user);
    } catch(err){
        res.status(500).send(err.message);
    }
});

export const usersJsRouter = router;