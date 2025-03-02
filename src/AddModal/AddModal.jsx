import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { firestore, storage } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import './AddModal.css'
import GoogleButton from 'react-google-button'

function AddModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Generate a random ID for file names
  const makeid = (length) => {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!')
      return
    }

    setUploading(true)
    const uniqueFileName = `/Shopper/${makeid(15)}-${file.name}`
    const storageRef = ref(storage, uniqueFileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressPercent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(progressPercent.toFixed(0))
        },
        (error) => {
          console.error('Upload failed:', error)
          setUploading(false)
          reject(error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          setUploading(false)
          resolve(downloadURL)
        }
      )
    })
  }

  const handleSubmit = async () => {
    if (!name) {
      alert('Item name is required!')
      return
    }

    if (!file) {
      alert('Please upload an image')
      return
    }

    setUploading(true)

    try {
      const imageUrl = await handleUpload() // Wait for image upload to complete
      const userDocRef = doc(firestore, 'Shopping', name)
      const docSnap = await getDoc(userDocRef)

      if (!docSnap.exists()) {
        const item = { Name: name, Count: 0, Taker: '', imageUrl }
        await setDoc(userDocRef, item)

        setName('')
        setFile(null)
      } else {
        console.log('Item already exists in the database')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null // Hide modal if not open

  return (
    <div className="container-modal">
      <div className="modal-inputs">
        <input
          type="text"
          value={name}
          placeholder="Item Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          id="fileSelector"
          className="input-Hide-Name"
          type="file"
          hidden
          onChange={handleFileChange}
          required
        />
        <label htmlFor="fileSelector" className="file-label">
          📸 Take photo
        </label>
        {uploading && <span>Uploading {progress}%</span>}
      </div>
      <div className="modal-action-btn">
        <button
          className="btn-action-modal btn-action-top"
          onClick={() => handleSubmit()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Add'}
        </button>
        <button
          className="btn-action-modal btn-action-bottom"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

AddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default AddModal
