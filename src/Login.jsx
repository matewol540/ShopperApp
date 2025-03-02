import PropTypes from 'prop-types'
import './Login.css'

function Login({ handleGoogleSignIn }) {
  return (
    <div>
      <div style={{ width: '50vw' }}>
        <span className="tittle-span-text">Shopper</span>
      </div>
      <div className="btn-login">
        <button className="btn-logo-wrapper" onClick={handleGoogleSignIn}>
          <img
            className="btn-login-image"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google Logo"
          />
          <span
            style={{ fontFamily: 'Consolas, monaco, monospace', fontSize: 16 }}
          >
            Login with Google
          </span>
        </button>
      </div>
      <span className="footer-span-text">®AleJaja Company 2025</span>
    </div>
  )
}
Login.propTypes = {
  handleGoogleSignIn: PropTypes.func.isRequired, // Validate that path is a string and required
}
export default Login
