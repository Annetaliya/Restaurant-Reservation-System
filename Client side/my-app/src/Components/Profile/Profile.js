import React, {useEffect, useState} from 'react';


const Profile = ({ booking }) => {

    const [selectBooking, setSelectedBooking] = useState(null)
   

    const fetchBookingById = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/bookings/${id}`)
            if (!response.ok){
                console.log('Error fetching booking')
            }
            const result = await response.json()
            console.log('booking for user:', result)
            setSelectedBooking(result.data)

        } catch (error) {
            console.log(error.message)

        }
    }

    useEffect(() => {
        if (booking && booking.id) {
            fetchBookingById(booking.id)
        }
    }, [booking])
  return (
    <div>
        <div>
            {selectBooking ? 
            <p>{selectBooking.firstName}</p>
            
            : <p>No data yet</p>}
            
        </div>

    </div>
  )
}

export default Profile