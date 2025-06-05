const express = require('express');
const route = express.Router();
const { v4: uuidv4 } = require('uuid')
const supabase = require('../supaBaseClient')


route.post('/', async (req, res) => {
    const { endpoint, keys } = req.body;
    const id = uuidv4();
    
    if (!endpoint || !keys) {
        return res.status(400).json({ error: 'Missing subscription data'})
    }
    

    try {
        const { error } =  await supabase
            .from('subscriptions')
            .insert([{ id, endpoint, keys }])
        if (error) {
           console.error('Subscription insert failed:', error.message);
            return res.status(500).json({ error: 'Database Error' }); 
        }
        res.json({
            message: 'Subscription Saved'

        })
        console.log('Subscription received:', req.body);

    } catch (error) {
        console.log('Subscription insert failed:', error.message)
        return res.status(500).json({error: 'Database Error'})
    }

})

module.exports = route