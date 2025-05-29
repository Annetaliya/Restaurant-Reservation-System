const express = require('express');
const route = express.Router();
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../database2.js')
const supabase = require('../supaBaseClient.js');

route.get('/', async (req, res) => {
    
    try {
        const db = getDB();
       const {data, error }=  await supabase.from('reservations').select('*')
       if (error) {
        throw new Error(error.message)
       }
       res.json({ message: 'sucsess', data})

    } catch (err) {
        console.log('error fetching reservations:', err.message)
        res.status(500).json({error: err.message})

    }
   
})

route.get('/:id', async (req, res) => {
   
    try {
        
        const { data, error} = await supabase
                .from('reservations')
                .select('*')
                .eq('id', req.params.id)
                .single();

        if (error) {
            throw new Error(error.message) 
        }
        res.json({message: 'success', data})

    } catch (err) {
        console.log('Error getting reservation:', err.message)
        res.status(500).json({error: err.message})


    }
  

})

route.post('/', async (req, res) => {
    const {tableNumber, guestNumber,status, price, floorLevel} = req.body;
    
    if (!tableNumber || !guestNumber || !status || !floorLevel) {
        return res.status(400).json({"Error": "Error missing required field"})
    } 
    const reservationsid = uuidv4();
    try {
        const db = getDB();
        const { error } = await supabase
                .from('reservations')
                .insert([
                    {
                        id: reservationsid,
                        tableNumber,
                        guestNumber,
                        price,
                        status,
                        floorLevel
                    }
                ])
        if (error) {
            throw new Error(error.message)
        }
        
         res.json({
            message: "success",
            id: reservationsid
         })


    } catch (err) {
        console.log('Error posting a reservation table:', err.message)
        res.status(500).json({ error: err.message})

    }
   
})

route.patch('/:id', async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).json({error: 'no fields to update'})
    }
  
    try {
        const { error, data } = await supabase
                .from('rervations')
                .update({status})
                .eq('id', id)
        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({error: 'Reservation not found'})
        }
      
        res.json({message: 'reservations updated', reservationId: id })

    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database error' });

    }
})
module.exports = route