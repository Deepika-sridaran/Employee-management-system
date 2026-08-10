import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, InputGroup, Alert } from 'react-bootstrap'
import '../App.css'

function ForgotPassword() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    // Later connect to Flask Forgot Password API
    setSuccess('Password reset link has been sent to your email!')
  }

  return (
    <div className="login-page">
      <div className="background-image"></div>
      <div className="background-overlay"></div>

      <div className="login-card">
        <div className="system-name mb-3">
          <i className="bi bi-people-fill me-2"></i>
          Employee Management System
        </div>

        <div className="lock-icon">
          <i className="bi bi-key"></i>
        </div>

        <h2 className="welcome-title">Forgot Password?</h2>
        <p className="subtitle">Enter your email to reset password</p>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        {success && <Alert variant="success" className="py-2">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-4 input-field">
            <InputGroup.Text className="input-icon">
              <i className="bi bi-envelope"></i>
            </InputGroup.Text>
            <Form.Control type="email" placeholder="Email address" className="form-input" required />
          </InputGroup>

          <Button type="submit" className="login-btn w-100 mb-3">
            Reset Password <i className="bi bi-arrow-right ms-1"></i>
          </Button>

          <p className="register-text">
            <Link to="/login" className="register-link">
              <i className="bi bi-arrow-left me-1"></i> Back to Login
            </Link>
          </p>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPassword