
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const webpush = require('web-push');
const VAPIDKEY = process.env.WEB_PUSH_KEY;

const supabase = require('../supaBaseClient.js')


webpush.setVapidDetails(
  'mailto:annetaliya@gmail.com',
  'BGQOtwfwG5bzN0Vhyb_hIk_GhMXzkhlnnnk4vMjTBZq5_ZfwY69gcKhGq08TUY0hOtkbVHm1PnqfTVU_ehpBoMQ',
  VAPIDKEY,

)


async function notify (payload) {
    try {
        const {data: subscriptions, error } = await supabase.from('subscriptions').select('id, endpoint, keys');
        
        if (error) {
            throw error
        }
        console.log(`🧾 Subscriptions fetched from DB: ${subscriptions.length}`);
        for (const sub of subscriptions) {
            const subscription = {endpoint: sub.endpoint, keys: sub.keys}
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

    const {user_id, reservation_id, booking_date} = req.body;
    const formattedDate = parseBookingDate(booking_date)

    if (!user_id || !reservation_id || !booking_date) {

        return res.status(400).json({error: 'Missing user_id or reservation_id'})
    }

   
   
    const reservationIds = Array.isArray(reservation_id) ? reservation_id : [reservation_id]

    let bookedTables = [];
    let results = [];
    const trx = supabase.rpc('begin')
    try {

        for (const resId of reservationIds) {
            const bookingId = uuidv4();
            

            const { error: insertError } = await supabase.from('booking').insert([
                {
                    id: bookingId,
                    user_id,
                    reservation_id: resId,
                    booking_date: formattedDate,
                    status: 'confirmed'
                }
            ])

            if (insertError) throw insertError;

            await supabase.from('reservations').update({ status: 'reserved'}).eq('id', resId)

            const { data: reservationData } = await supabase
                .from('reservations')
                .select('table_number')
                .eq('id', resId)
                .single();


            //table number
            if (reservationData) {
                bookedTables.push(reservationData.table_number)
            }

            results.push({
                bookingId,
                user_id,
                reservation_id: resId,
                booking_date: formattedDate,
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
                message: `Tables ${tables} booKed on ${formattedDate.split('T')[0]}`,
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
            .select(`id, booking_date, status, users(first_name, second_name, email), reservations(table_number, guest_number, floor_level)`)
   
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
            .select(`id, booking_date, status, users(first_name, second_name, email), reservations(table_number, guest_number, floor_level)`)
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
        .select(`id, booking_date, status, users(first_name, second_name, email), reservations(table_number, guest_number, floor_level, price)`)
        .eq('user_id', req.params.id)
        .order('booking_date', { ascending: false });

        if (error) {
            throw new Error(error.message)
        }
       
        res.json({ data })

    } catch (error) {
        res.status(500).json({error: error.message})

    }
    
    
})

router.patch('/:id', async (req, res) => {
    
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
        .select('reservation_id, user_id')
        .eq('id', bookingId)
        .single()
    
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
    const { error: reservationError } = await supabase
        .from('reservations')
        .update({ status: 'available'})
        .eq('id', booking.reservation_id)

        if (reservationError) {
            return res.status(500).json({ error: reservationError.message})
        }

    //update the reservation table as available after cancellation of booking
   // (await supabase.from('reservations').update({ status: 'available'})).eq('id', booking.reservation_id)

   

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