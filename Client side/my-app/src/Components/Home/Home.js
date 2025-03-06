import React, { useEffect, useState } from 'react';
import { FaCircle } from "react-icons/fa";
import './home.css';

const Home = () => {
    const [reservationTable, setReservationTable] = useState([]);
    const [loading, setLoading] =  useState(false);
    

    const handleTableChange = () => {

    }





    const fetchReservationTables = async () => {
        setLoading(true)
        try {
            const response =  await fetch('http://localhost:8000/reservations');
            if (!response.ok) {
                throw new Error (`Response status ${response.status}`)
            }
            const result =  await response.json();
            setReservationTable(result.data)
            
            setLoading(false)
            console.log(result)


        } catch (err) {
            console.log(err.message)

        }
    }
    useEffect(() => {
        fetchReservationTables()
    }, [])
  return (
    <div>
        <h1 className='homeIntro'>Welcome to eatery bay!</h1>
        <p className='homeTxt'>Please first choose your prefered floor level</p>
        <div className='floorLevels'>
            <button>Level 1</button>
            <button>Level 2</button>
            <button>Level 3</button>
        </div>
        <div className='tableItems'>
            {reservationTable.length !== 0 ?

            reservationTable.map((item) => (
            
                <div key={item.id} className='individualTable'>
                    <FaCircle className={`availability ${item.status === 'available' ? 'availability' : 'noAvailability'}`}/>
                    <div className='table'></div>
                    <p>{item.tableNumber}</p>
                </div>
                    
                
            ))
            : <p>No tables available</p>}
        </div>
    </div>
  )
}

export default Home