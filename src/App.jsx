import Login from './Login'
import Home from './Home'
import { auth, firestore, provider, signInWithPopup } from './firebase'
import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user) // If user is logged in, update the state
    })

    return () => unsubscribe() // Clean up the listener when component unmounts
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
      navigate('/')
      const userDocRef = doc(firestore, 'Users', result.user.email)
      const docSnap = await getDoc(userDocRef)
      if (!docSnap.exists())
        await setDoc(userDocRef, {
          name: result.user.displayName,
          email: result.user.email,
          OwnedLists: [],
          AdminCollection: [],
        })
      else console.log('Uzytkownik istnieje')
    } catch (error) {
      console.error('Error signing in with Google:', error.message)
    }
  }
  const logoutFunction = async () => {
    try {
      await auth.signOut()
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error('Error signing in with Google:', error.message)
    }
  }

  return (
    <div style={{ height: '100%', width: '100%', overflowX: 'hidden' }}>
      <Routes>
        {!user ? (
          <>
            <Route
              path="/"
              element={<Login handleGoogleSignIn={handleGoogleSignIn} />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Home handleLogout={logoutFunction} />} />
          </>
        )}
      </Routes>
    </div>
  )
}

export default App
