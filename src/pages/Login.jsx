import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, InputGroup, Alert, Row, Col } from 'react-bootstrap'
import '../App.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSuccess('Login successful! Redirecting to dashboard...')
  }

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="auth-container d-flex bg-white shadow rounded-4 overflow-hidden">
              
              {/* ========== Left Side ========== */}
              <div className="auth-left d-none d-md-flex flex-column justify-content-between text-white p-5">
                <div className="text-center">
                  <div className="brand-icon mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle">
                    <i className="bi bi-people-fill fs-2"></i>
                  </div>
                  <h2 className="fw-bold mb-3">
                    Employee<br />Management<br />System
                  </h2>
                  <div className="divider mx-auto mb-4"></div>
                  <p className="fs-5 fw-semibold mb-1">Welcome back!</p>
                  <p className="opacity-75">
                    Please login to your account<br />to continue
                  </p>
                </div>

                {/* Icon Illustration */}
                <div className="text-center mt-4">
                  <div className="illustration-box mx-auto d-flex align-items-center justify-content-center">
                    <i className="bi bi-laptop"></i>
                  </div>
                  <p className="mt-3 small opacity-75">Manage your team efficiently</p>
                </div>
              </div>

              {/* ========== Right Side - Form ========== */}
              <div className="auth-right p-4 p-md-5 d-flex align-items-center">
                <div className="w-100" style={{ maxWidth: '380px', margin: '0 auto' }}>
                  <h3 className="fw-bold mb-1">Login</h3>
                  <p className="text-muted mb-4">
                    Enter your credentials to access your account
                  </p>

                  {error && (
                    <Alert variant="danger" className="py-2">
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="success" className="py-2 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill"></i>
                      {success}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-white">
                          <i className="bi bi-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-white">
                          <i className="bi bi-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          required
                        />
                        <InputGroup.Text
                          className="bg-white"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        id="remember"
                        label="Remember me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <Link
                        to="/forgot-password"
                        className="text-primary text-decoration-none fw-medium"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 py-2 fw-semibold mb-3"
                    >
                      Login
                    </Button>

                    <div className="d-flex align-items-center my-3">
                      <hr className="flex-grow-1" />
                      <span className="px-3 text-muted small">or</span>
                      <hr className="flex-grow-1" />
                    </div>

                    <p className="text-center text-muted mb-0">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        className="text-primary fw-semibold text-decoration-none"
                      >
                        Register here
                      </Link>
                    </p>
                  </Form>
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </div>
    </div>  
  )
}

export default Login