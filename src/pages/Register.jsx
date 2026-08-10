import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, InputGroup, Alert } from 'react-bootstrap'
import '../App.css'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    // Later connect to Flask Register API
    setSuccess('Registration successful! Please login.')
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
          <i className="bi bi-person-plus"></i>
        </div>

        <h2 className="welcome-title">Create Account</h2>
        <p className="subtitle">Register to get started</p>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        {success && <Alert variant="success" className="py-2">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3 input-field">
            <InputGroup.Text className="input-icon">
              <i className="bi bi-person"></i>
            </InputGroup.Text>
            <Form.Control type="text" placeholder="Full Name" className="form-input" required />
          </InputGroup>

          <InputGroup className="mb-3 input-field">
            <InputGroup.Text className="input-icon">
              <i className="bi bi-envelope"></i>
            </InputGroup.Text>
            <Form.Control type="email" placeholder="Email address" className="form-input" required />
          </InputGroup>

          <InputGroup className="mb-3 input-field">
            <InputGroup.Text className="input-icon">
              <i className="bi bi-telephone"></i>
            </InputGroup.Text>
            <Form.Control type="tel" placeholder="Phone Number" className="form-input" required />
          </InputGroup>

          <InputGroup className="mb-3 input-field">
            <InputGroup.Text className="input-icon">
              <i className="bi bi-lock"></i>
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="form-input"
              required
            />
            <InputGroup.Text
              className="input-icon eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </InputGroup.Text>
          </InputGroup>

          <InputGroup className="mb-4 input-field">
            <InputGroup.Text className="input-icon">
              <i className="bi bi-lock-fill"></i>
            </InputGroup.Text>
            <Form.Control
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="form-input"
              required
            />
            <InputGroup.Text
              className="input-icon eye-icon"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${showConfirm ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </InputGroup.Text>
          </InputGroup>

          <Button type="submit" className="login-btn w-100 mb-3">
            Register <i className="bi bi-arrow-right ms-1"></i>
          </Button>

          <p className="register-text">
            Already have an account?{' '}
            <Link to="/login" className="register-link">
              Login here <i className="bi bi-arrow-right"></i>
            </Link>
          </p>
        </Form>
      </div>
    </div>
  )
}

export default Register