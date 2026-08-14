import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, InputGroup, Alert } from 'react-bootstrap'
import '../App.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password should match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed')
      }
      setSuccess('Password reset successfully! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
        <p className="subtitle">Enter your email and choose a new password</p>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        {success && <Alert variant="success" className="py-2">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3 input-field">
            <InputGroup.Text className="input-icon"><i className="bi bi-envelope"></i></InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Email address"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup className="mb-3 input-field">
            <InputGroup.Text className="input-icon"><i className="bi bi-lock"></i></InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="New Password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup className="mb-4 input-field">
            <InputGroup.Text className="input-icon"><i className="bi bi-lock-fill"></i></InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Confirm New Password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputGroup>

          <Button type="submit" className="login-btn w-100 mb-3" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'} <i className="bi bi-arrow-right ms-1"></i>
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