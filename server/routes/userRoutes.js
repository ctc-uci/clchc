import express from 'express';
import { db } from '@/db/db-pgp';
import { keysToCamel } from '@/common/utils';

const router = express.Router();

// Create a new user
router.post('/',async(req,res) =>{
    try {
        const { firebaseUid, role, firstName, lastName, email, status, apptCalcFactor } = req.body;
        
        const result = await db.query(
        'INSERT INTO users (firebase_uid, role, first_name, last_name, email, status, appt_calc_factor)VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [firebaseUid, role, firstName, lastName, email, status, apptCalcFactor]
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

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(keysToCamel(result));
    } catch(err){
        res.status(500).send(err.message);
    }
});
// Update a user by ID
router.put('/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const {firebaseUid, role, firstName, lastName, email, status, apptCalcFactor} = req.body;
        
        const result = await db.query(
        'UPDATE users SET firebase_uid=COALESCE($1, firebase_uid), role=COALESCE($2, role), first_name=COALESCE($3, first_name), last_name=COALESCE($4, last_name), email=COALESCE($5, email), status=COALESCE($6, status), appt_calc_factor=COALESCE($7, appt_calc_factor) WHERE id=$8 RETURNING *',
        [firebaseUid, role, firstName, lastName, email, status, apptCalcFactor, id]
        );
        if (!result || result.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
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

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(keysToCamel(result));
    } catch(err){
        res.status(500).send(err.message);
    }
});

export const usersJsRouter = router;