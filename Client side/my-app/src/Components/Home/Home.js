import React, { useEffect, useState } from 'react';
import { FaCircle } from "react-icons/fa";
import './home.css';
import Booking from '../Booking/Booking';

const Home = ( ) => {
    const [reservationTable, setReservationTable] = useState([]);
    const [loading, setLoading] =  useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Level 1')
    const [table, setTable] = useState(null);
   

    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    

    const filterdTables = reservationTable.filter((item) => item.floorLevel === selectedLevel)

    const fetchReservationTables = async () => {
        
        try {
            const response =  await fetch('http://localhost:8000/reservations');
            if (!response.ok) {
                throw new Error (`Response status ${response.status}`)
            }
            const result =  await response.json();
            setReservationTable(result.data)
            console.log(result)

        } catch (err) {
            console.log(err.message)

        }
    }
    useEffect(() => {
        fetchReservationTables()
    }, [])

    const fetchTablebyId = async (id) => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8000/reservations/${id}`)
            if (!response.ok) {
                console.log('Errorfetching table')
            }
            const result = await response.json();
            console.log('cicked table',result);
            setTable(result.data)
            setLoading(false)

        } catch (error) {
            console.log(error.message)
        }
    }

   
  return (
    <div>
        {user && 
            <h1 className='homeIntro'>Welcome to eatery bay {user.firstName}! 
            </h1>
            
        }
        
        <p className='homeTxt'>Please first choose your prefered floor level</p>
        <div className='floorLevels'>
            <button onClick={() => setSelectedLevel('Level 1')}>Level 1</button>
            <button onClick={() => setSelectedLevel('Level 2')}>Level 2</button>
            <button onClick={() => setSelectedLevel('Level 3')}>Level 3</button>
        </div>
        <div className='tableItems'>
            {filterdTables.length !== 0 ?

            filterdTables.map((item) => (
            
                <div key={item.id} className='individualTable' onClick={() => fetchTablebyId(item.id)} >
                    <FaCircle className={`availability ${item.status === 'available' ? 'availability' : 'noAvailability'}`}/>
                    <div className='table'></div>
                    <p className='tableNumber'>Table No.{item.tableNumber}</p>
                    <p className='guestNumber'>Guest Number {item.guestNumber}</p>
                </div>       
                
            ))
            : <p>No tables available</p>}
        </div>
        {loading ? (
            <p>...loading</p>
        ) : table ? (
            table.status === 'reserved' ? (
                <h1>Not available</h1>
            ) : (
                <Booking table={table} />
            )
        ) : (
            <p>No tables available</p>
        )
    }
    </div>
  )
}

export default Home