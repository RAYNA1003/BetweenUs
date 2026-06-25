import React from 'react'
import { Navigate } from 'react-router-dom'

export default function withAuth(WrappedComponent) {
    return function AuthenticatedComponent(props) {
        const token = localStorage.getItem('token');

        if (!token) {
            return <Navigate to="/auth" replace />
        }

        return <WrappedComponent {...props} />
    }
}