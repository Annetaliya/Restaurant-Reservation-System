import React, { useEffect, useState } from 'react'

const Home = () => {
    const [reservation, setResevation] = useState([]);
    const [loading, setLoading] =  useState(false);

   
    const fetchReservations = async() => {
        setLoading(true);
        try{
            const response = await fetch('http://localhost:8000/reservations')
            const result = await response.json();
            setResevation(result.data);
            setLoading(false);
            console.log(reservation)

        } catch(error) {
            console.log('Error fetching', error.message)

        }

    }

    useEffect(() => {
        fetchReservations()
    }, [])
  return (
    <div>
        {reservation.length !== 0 ? 
        reservation.map((item) => (
            <div key={item.id}>
                <p>{item.floorLevel}</p>
                <p>Table No:{item.tableNumber}</p>
                {item.status === 'available' ? <div>available</div> : <div>Not available</div>}


            </div>

        ))
        : <p>No reservation tables provided</p>
        }
    </div>
  )
}

export default Home