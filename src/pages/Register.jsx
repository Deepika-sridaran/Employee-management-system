import { useState } from 'react'
import './Register.css'

import { useNavigate, Link } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  LinearProgress,
} from '@mui/material'

import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  Groups,
  ArrowForward,
  Security,
  CheckCircle,
} from '@mui/icons-material'

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Password strength
  const getPasswordStrength = () => {
    let strength = 0

    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    return strength
  }

  const strength = getPasswordStrength()

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    // Full name validation
    if (fullName.trim().length < 3) {
      setError('Please enter your full name')
      return
    }

    // Password validation
    if (password.length < 8) {
      setError('Password must contain at least 8 characters')
      return
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError('Password and Confirm Password should match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            phone,
            password,
            confirm_password: confirmPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess('Account created successfully!')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        background:
          'linear-gradient(135deg, #0f172a 0%, #164e63 50%, #0369a1 100%)',
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          height: '100vh',
          borderRadius: 0,
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <Box className="row g-0 w-100 h-100">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <Box
            className="col-lg-5 d-none d-lg-flex"
            sx={{
              color: 'white',
              height: '100vh',
              p: {
                md: 4,
                lg: 6,
                xl: 8,
              },
              flexDirection: 'column',
              justifyContent: 'center',
              background:
                'linear-gradient(160deg, #0284c7 0%, #075985 45%, #0f172a 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >

            {/* Decorative circle */}

            <Box
              sx={{
                position: 'absolute',
                width: 350,
                height: 350,
                borderRadius: '50%',
                background:
                  'rgba(255,255,255,0.05)',
                top: -150,
                right: -120,
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                width: 250,
                height: 250,
                borderRadius: '50%',
                background:
                  'rgba(255,255,255,0.04)',
                bottom: -100,
                left: -100,
              }}
            />

            {/* Left Content */}

            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
              }}
            >

              {/* Logo */}

              <Box
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor:
                    'rgba(255,255,255,0.15)',
                  border:
                    '1px solid rgba(255,255,255,0.2)',
                  mb: 3,
                }}
              >
                <Groups
                  sx={{
                    fontSize: 36,
                    color: '#ffffff',
                  }}
                />
              </Box>

              {/* Title */}

              <Typography
                fontWeight={700}
                sx={{
                  mb: 2,
                  lineHeight: 1.15,
                  fontSize: {
                    md: '2rem',
                    lg: '2.5rem',
                    xl: '3rem',
                  },
                }}
              >
                Employee
                <br />
                Management System
              </Typography>

              <Typography
                sx={{
                  color:
                    'rgba(255,255,255,0.75)',
                  lineHeight: 1.7,
                  fontSize: {
                    md: 14,
                    lg: 16,
                  },
                  maxWidth: 500,
                  mb: {
                    md: 4,
                    lg: 5,
                  },
                }}
              >
                Manage your employees, teams and
                organization efficiently from one
                powerful and secure platform.
              </Typography>

              {/* FEATURES */}

              <Box
                className="d-flex flex-column"
                sx={{
                  gap: {
                    md: 2.5,
                    lg: 3,
                  },
                }}
              >

                {/* Secure */}

                <Box
                  className="d-flex align-items-center gap-3"
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      minWidth: 42,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'rgba(255,255,255,0.12)',
                    }}
                  >
                    <Security fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      fontWeight={600}
                      fontSize={15}
                    >
                      Secure & Reliable
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          'rgba(255,255,255,0.6)',
                        fontSize: 12,
                      }}
                    >
                      Your information stays protected
                    </Typography>
                  </Box>
                </Box>

                {/* Employees */}

                <Box
                  className="d-flex align-items-center gap-3"
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      minWidth: 42,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'rgba(255,255,255,0.12)',
                    }}
                  >
                    <Groups fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      fontWeight={600}
                      fontSize={15}
                    >
                      Manage Employees
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          'rgba(255,255,255,0.6)',
                        fontSize: 12,
                      }}
                    >
                      Everything in one place
                    </Typography>
                  </Box>
                </Box>

                {/* Easy */}

                <Box
                  className="d-flex align-items-center gap-3"
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      minWidth: 42,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'rgba(255,255,255,0.12)',
                    }}
                  >
                    <CheckCircle fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      fontWeight={600}
                      fontSize={15}
                    >
                      Easy to Use
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          'rgba(255,255,255,0.6)',
                        fontSize: 12,
                      }}
                    >
                      Simple and intuitive interface
                    </Typography>
                  </Box>
                </Box>

              </Box>
            </Box>
          </Box>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <Box
            className="col-lg-7"
            sx={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
            }}
          >

            <CardContent
              sx={{
                width: '100%',
                maxWidth: 700,
                mx: 'auto',

                px: {
                  xs: 3,
                  sm: 4,
                  md: 5,
                  lg: 6,
                },

                py: {
                  xs: 2,
                  sm: 3,
                  md: 3,
                },
              }}
            >

              {/* Header */}

              <Box sx={{ mb: 2 }}>

                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#e0f2fe',
                    color: '#0284c7',
                    mb: 1.5,
                  }}
                >
                  <Groups />
                </Box>

                <Typography
                  fontWeight={700}
                  color="#172033"
                  sx={{
                    fontSize: {
                      xs: '1.8rem',
                      md: '2.1rem',
                    },
                  }}
                >
                  Create Account
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: 14,
                  }}
                >
                  Register your employee account to get
                  started
                </Typography>
              </Box>

              {/* Error */}

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    py: 0.5,
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Success */}

              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    py: 0.5,
                  }}
                >
                  {success}
                </Alert>
              )}

              {/* FORM */}

              <form onSubmit={handleSubmit}>

                {/* Full Name */}

                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  required
                  size="small"
                  margin="dense"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person
                          color="action"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />

                {/* Email */}

                <TextField
                  fullWidth
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  size="small"
                  margin="dense"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email
                          color="action"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />

                {/* Phone */}

                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                  size="small"
                  margin="dense"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone
                          color="action"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />

                {/* Password */}

                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Create a password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  size="small"
                  margin="dense"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock
                          color="action"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          size="small"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />

                {/* Password Strength */}

                {password && (
                  <Box
                    sx={{
                      mt: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={strength * 25}
                      color={
                        strength <= 1
                          ? 'error'
                          : strength === 2
                          ? 'warning'
                          : 'success'
                      }
                      sx={{
                        height: 4,
                        borderRadius: 5,
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: 10,
                      }}
                    >
                      {strength === 1 &&
                        'Weak password'}

                      {strength === 2 &&
                        'Fair password'}

                      {strength === 3 &&
                        'Good password'}

                      {strength === 4 &&
                        'Strong password'}
                    </Typography>
                  </Box>
                )}

                {/* Confirm Password */}

                <TextField
                  fullWidth
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type={
                    showConfirm
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                  size="small"
                  margin="dense"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock
                          color="action"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          size="small"
                          onClick={() =>
                            setShowConfirm(
                              !showConfirm
                            )
                          }
                          edge="end"
                        >
                          {showConfirm ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />

                {/* Security */}

                <Box
                  className="d-flex align-items-center gap-2"
                  sx={{
                    mt: 1.5,
                    mb: 2,
                    color: 'text.secondary',
                  }}
                >
                  <Security
                    sx={{
                      fontSize: 17,
                      color: '#16a34a',
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11 }}
                  >
                    Your information is securely protected.
                  </Typography>
                </Box>

                {/* Submit */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  endIcon={<ArrowForward />}
                  sx={{
                    height: 48,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: 15,
                    fontWeight: 600,
                    background:
                      'linear-gradient(135deg, #0284c7, #0369a1)',
                    boxShadow:
                      '0 7px 18px rgba(2,132,199,.25)',

                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #0369a1, #075985)',
                      boxShadow:
                        '0 9px 22px rgba(2,132,199,.35)',
                    },
                  }}
                >
                  {loading
                    ? 'Creating Account...'
                    : 'Create Account'}
                </Button>

              </form>

              {/* Login */}

              <Box
                sx={{
                  textAlign: 'center',
                  mt: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={13}
                >
                  Already have an account?{' '}

                  <Link
                    to="/login"
                    style={{
                      color: '#0284c7',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>

            </CardContent>
          </Box>

        </Box>
      </Card>
    </Box>
  )
}

export default Register
