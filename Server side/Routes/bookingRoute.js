
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const webpush = require('web-push');
const VAPIDKEY = process.env.WEB_PUSH_KEY;
const { getDB } = require('../database2.js');
const supabase = require('../supaBaseClient.js')


webpush.setVapidDetails(
  'mailto:annetaliya@gmail.com',
  'BGQOtwfwG5bzN0Vhyb_hIk_GhMXzkhlnnnk4vMjTBZq5_ZfwY69gcKhGq08TUY0hOtkbVHm1PnqfTVU_ehpBoMQ',
  VAPIDKEY,

)


async function notify (payload) {
    const db = getDB();
    try {
        const {data: subscriptions, error } = await supabase.from('subscriptions').select('id, subscriptions');
        console.log(`🧾 Subscriptions fetched from DB: ${rows.length}`);
        for (const sub of subscriptions) {
            const subscription = JSON.parse(row.subscriptions);
            try {
                await webpush.sendNotification(subscription, JSON.stringify(payload))
                console.log(`Push sent to subscription ID ${sub.id}`)

            } catch (err) {
                console.log('Push error', err.status, err.body)
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.log(`Subscription ${sub.id} no longer available`)
                    await supabase.from('subscriptions').delete().eq('id', sub.id)
                }
            }
        }
    } catch (err) {
        console.error('Error getting subscriptions', err);
    }
   
}

async function deleteSubscription(id) {
    const db = getDB();
    try {
        await db.execute('DELETE FROM subscriptions WHERE id = ?', [id])
        console.log(`Deleted subscription with id ${id}`);

    } catch (error) {
         console.log('Failed to delete', error.message)
    }
}

router.post('/', async (req, res) => {
    const parseBookingDate = (dateStr) => {
        const [day, month, yearAndTime] =  dateStr.split('/');
        const [year, time] = yearAndTime.split(' ')
        return `${year}-${month}-${day} ${time}`;
    }

    const {userId, reservationId, bookingDate} = req.body;
    const formattedDate = parseBookingDate(bookingDate)

    if (!userId || !reservationId || !bookingDate) {

        return res.status(400).json({error: 'Missing userId or reservationId'})
    }

    const db = getDB();
    const connection = await db.getConnection();
    const reservationIds = Array.isArray(reservationId) ? reservationId : [reservationId]

    let bookedTables = [];
    let results = [];
    const trx = supabase.rpc('begin')
    try {

        for (const resId of reservationIds) {
            const bookingId = uuidv4();
            const status = 'confirmed';

            const { error: insertError } = await supabase.from('booking').insert([
                {
                    id: bookingId,
                    userId,
                    reservationId: resId,
                    bookingDate, formattedDate,
                    status: 'confirmed'
                }
            ])

            if (insertError) throw insertError;

            await supabase.from('resevations').update({ status: 'reserved'}).eq('id', resId)

            const { data: reservationData } = await supabase
                .from('resevations')
                .select('tableNumber')
                .eq('id', resId)
                .single();


            //table number
            if (reservationData) {
                bookedTables.push(reservationData.tableNumber)
            }

            results.push({
                bookingId,
                userId,
                reservationId: resId,
                bookingDate: formattedDate,
                status: 'confirmed'
            })
        }
   
        res.status(201).json({
            message: 'Booking created successfully',
            data: results
        })
        const tables = bookedTables.join(', ');


        await notify({
            title: 'New booking received',
            body: {
                message: `Tables ${tables} booKed on ${formattedDate.split(' ')[0]}`,
                bookingId: results[0].bookingId
            }
        })

    } catch (error) {
        
        console.log('Error creating bookings', error.message)
        res.status(500).json({ error: 'Database error'})

    }
      
})



router.get('/', async (req, res) => {
    
    try {
        const { data, error } = await supabase
            .from('booking')
            .select(`id, bookingDate, status, users(firstName, secondName, email), reservations(tableNumber, guestNumber, floorLevel)`)
   
        if (error) {
            throw new Error(error.message)
        }
        res.json({ data })
    } catch (error) {
         res.status(500).json({error: error.message})
    }
    
})

router.get('/:id', async (req, res) => {
    try {
        const { data, error } =  await supabase
            .from('booking')
            .select(`id, bookingDtae, status, users(firstName, secondName, email), reservations(tableNumber, guestNumber, floorLevel)`)
            .eq('id', req.params.id)
            .single();
        
        if (error) {
            return res.status(404).json({
                "error": "Booking not found" 
            })
        }

        
         res.json({
            message: "ok",
            data
        })

    } catch (error) {
        res.status(500).json({error: error.message})

    }
    
})
router.get('/user/:id', async (req,res) => {
    
    try {
       const {data, error} = await supabase
        .from('booking')
        .select(`id, bookingDate, status, users(firstName, secondName, email), reservations(tableNumber, guestNumber, floorLevel, price)`)
        .eq('userId', req.params.id)
        .order('bookingDate', { ascending: false });

        if (error) {
            throw new Error(error.message)
        }
       
        res.json({ data })

    } catch (error) {
        res.status(500).json({error: error.message})

    }
    
    
})

router.patch('/:id', async (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const {status} = req.body;

    if (!status) {
        return res.status(400).json({error: 'no fields to update'})
    }
     try {
        const {data, error} = await supabase
            .from('booking')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .single()

         if (error) return res.status(404).json({ error: 'Booking not found' });
      
        res.json({
            message: 'updated booking successfuly',
            data
        })

     } catch (error) {
        console.error('Database error:', error.message)
        res.status(500).json({error: 'Dtabase error'})

     }

})

router.delete('/:id', async (req, res) =>{
   const bookingId = req.params.id;

   try {
    //getting the reservation id and user id
    const {data: booking, error: findError} = await supabase
        .from('booking')
        .select('reservationId, userId')
        .eq('id', bookingId)
        .single()
    
    const getReservationSql =  `SELECT reservationId, userId FROM booking WHERE id = ?`;
    const [rows] = await db.execute(getReservationSql, [bookingId])
    if (findError) {
        return res.status(404).json({message: 'Booking not found'})
    }

    const { error: cancelError } = await supabase
        .from('booking')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)



    if (cancelError) {
        return res.status(500).json({error: cancelError.message})
    }

    //update the reservation table as available after cancellation of booking
    (await supabase.from('reservations').update({ status: 'available'})).eq('id', booking.reservationId)

   

    res.json({
        message: 'Booking deleted',
        data: booking
    })

   } catch (error) {
        console.error('Error in deleting booking:', error.message);
        res.status(500).json({ error: 'Database error' });

   }
})




module.exports = router