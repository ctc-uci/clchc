import express from 'express';
import { db } from '@/db/db-pgp';
import { keysToCamel } from '@/common/utils';

const router = express.Router();

// Create a new user
router.post('/',async(req,res) =>{
    try {
        const { email, firebaseUid } = req.body;
        
        const result = await db.query(
        'INSERT INTO users (email, firebase_uid) VALUES ($1, $2) RETURNING *',
        [email, firebaseUid]
        );
        
        res.status(201).json(keysToCamel(result));
  } catch (err) {
        res.status(500).send(err.message);
  }
})
// Get all users
router.get('/', async(req,res)=>{
    try{
        const result = await db.query('SELECT * from users');
        res.status(200).json(keysToCamel(result));
    } catch(err){
        res.status(500).send(err.message);
    }
})
// Get a user by ID
router.get('/:id', async(req,res)=>{
    try{
        const {id} = req.params

        const result = await db.query('SELECT * from users WHERE id=$1',[id]);
        res.status(200).json(keysToCamel(result));
    } catch(err){
        res.status(500).send(err.message);
    }
});
// Update a user by ID
router.put('/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const { email, firebaseUid } = req.body;
        
        const result = await db.query(
        'UPDATE users SET email=$1, firebase_uid=$2 WHERE id=$3 RETURNING *',
        [email, firebaseUid, id]
        );
        
        res.status(200).json(keysToCamel(result));
    } catch(err){
        res.status(500).send(err.message); 
    }
});
// Delete a user by ID
router.delete('/:id', async(req,res)=>{
    try{
        const {id} = req.params;

        const result = await db.query('DELETE FROM users WHERE id=$1 RETURNING *',[id]);
        res.status(200).json(keysToCamel(result));
    } catch(err){
        res.status(500).send(err.message);
    }
});

export const usersJsRouter = router;