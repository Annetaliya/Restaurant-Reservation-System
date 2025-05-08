import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ user }) => {
    const navigate = useNavigate();
    if (user?.role !== 'admin') {
        Swal.fire('Access denied')
        navigate('/')
    }

  return (
    <Outlet />
  )
}

export default ProtectedRoute