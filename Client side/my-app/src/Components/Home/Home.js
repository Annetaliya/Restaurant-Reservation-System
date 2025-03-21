import React, { use, useEffect, useState } from 'react';
import { FaCircle } from "react-icons/fa";
import './home.css';
import Booking from '../Booking/Booking';

const Home = ({ booking }) => {
    const [reservationTable, setReservationTable] = useState([]);
    const [loading, setLoading] =  useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Level 1')
    const [selectIndex, setSelectedIndex] = useState(0)
    const [table, setTable] = useState(null);
    console.log('This is home page booking:', booking)
    
   

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

    const fetchUpdateReservationTable = async (id) => {
        if (booking.status === 'confirmed') {
            try { 
                const response =  await fetch(`http://localhost:8000/reservations/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({status: 'reserved'})
                })
                if (response.ok) {
                    setReservationTable((prev) => 
                        prev.map((item) => 
                            item.id === id ? {...item, status: 'reserved'} : item
                        )
                    )
                }

                const updatedData =  await response.json();
                console.log('this is a reserved table being updated', updatedData)

            } catch (error) {
                console.log(error.message)

            }
        }
       
        
    }
    useEffect(() => {
        fetchUpdateReservationTable(booking.reservationId)
    }, [])

   
  return (
    <div>
        {user && 
            <h1 className='homeIntro'>Welcome to eatery bay {user.firstName}! 
            </h1>
            
        }
        
        <p className='homeTxt'>Please first choose your prefered floor level</p>
        <div className='floorLevels'>
            {['Level 1', 'Level 2', 'Level 3'].map((level, index) => (
                <button 
                key={index}
                className={`levelbutton ${selectIndex === index ? 'active' : ''}`}
                onClick={() => {setSelectedLevel(level)
                                setSelectedIndex(index)

                }}
                
                >
                    {level}
        
                </button>
            ))}

        </div>
        <div className='tableItems'>
            {filterdTables.length !== 0 ?

            filterdTables.map((item) => (
            
                <div key={item.id} className='individualTable' onClick={() => fetchTablebyId(item.id)} >
                    <FaCircle className={`availability ${item.status === 'available' ? 'availability' : 'noAvailability'}`}/>
                    <div className='table'></div>
                    <p className='tableNumber'>Table No.{item.tableNumber}</p>
                    <p className='guestNumber'>Guest Number {item.guestNumber}</p>
                    <p>${item.price}</p>
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
            ''
        )
    }
    </div>
  )
}

export default Home