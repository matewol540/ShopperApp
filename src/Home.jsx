import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { firestore, collection, onSnapshot } from './firebase'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import './Home.css'
import ShopItem from './ShopItem/ShopItem'
import AddModal from './AddModal/AddModal'
import { getAuth } from 'firebase/auth'

function Home({ handleLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fridgeItems, setFridgeItems] = useState([])
  const [shoppingItems, setShoppingItems] = useState([])

  useEffect(() => {
    const FridgeContentRef = collection(firestore, 'Fridge')
    const unsubscribe = onSnapshot(FridgeContentRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data())
      setFridgeItems(items)
      console.log(fridgeItems)
    })
    return () => unsubscribe()
  }, [])
  useEffect(() => {
    const ShoppingContentRef = collection(firestore, 'Shopping')
    const unsubscribe = onSnapshot(ShoppingContentRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data())
      setShoppingItems(items)
      console.log(shoppingItems)
    })
    return () => unsubscribe()
  }, [])

  const increase = async (name, vector) => {
    const userDocRef = doc(firestore, 'Fridge', name)
    const docSnap = await getDoc(userDocRef)
    if (docSnap.exists()) {
      const item = fridgeItems.find((item) => item.Name == name)
      if (item && item.Count + vector > 0) {
        item.Count = item.Count + vector
        await setDoc(userDocRef, item)
      } else {
        item.Count = item.Count + vector
        item.Taker = null
        await deleteDoc(userDocRef)
        const shoppingDocRef = doc(firestore, 'Shopping', name)
        const docSnapShopping = await getDoc(shoppingDocRef)
        if (!docSnapShopping.exists()) {
          await setDoc(shoppingDocRef, item)
        }
      }
      //If 0 move to shopping list
    }
  }
  const removeItem = async (name) => {
    const userDocRef = doc(firestore, 'Fridge', name)
    const docSnap = await getDoc(userDocRef)
    if (docSnap.exists()) {
      await deleteDoc(userDocRef)
    }
  }
  const takeItem = async (name) => {
    const auth = getAuth()
    const user = auth.currentUser
    const userDocRef = doc(firestore, 'Shopping', name)
    const docSnap = await getDoc(userDocRef)
    if (docSnap.exists()) {
      const item = shoppingItems.find((item) => item.Name == name)
      if (item && (!item.Taker || item.Taker == '')) {
        item.Taker = user.displayName
        await setDoc(userDocRef, item)
      } else console.log('To small count de decrease')
    }
  }
  const saveShopping = async () => {
    shoppingItems.forEach(async (item) => {
      if (item.Taker) {
        const fridgeDocReference = doc(firestore, 'Fridge', item.Name)
        const fridgeDocumentItem = await getDoc(fridgeDocReference)
        if (!fridgeDocumentItem.exists()) {
          item.Count = 1
          console.log(item)
          await setDoc(fridgeDocReference, item)
          const userDocRef = await doc(firestore, 'Shopping', item.Name)
          const docSnap = await getDoc(userDocRef)
          if (docSnap.exists()) {
            await deleteDoc(userDocRef)
          }
        }
      }
    })
  }

  return (
    <div className="container">
      <span className="home-tittle-span">Fridge Content</span>
      <div className="half-screen">
        <div className="items-content-flex">
          {fridgeItems.length > 0 ? (
            fridgeItems.map((item) => (
              <div key={item.Name} className="Item-flex">
                <ShopItem
                  item={item}
                  onAddItem={() => increase(item.Name, 1)}
                  onDeleteItem={() => increase(item.Name, -1)}
                  onRemoveItem={() => removeItem(item.Name, 1)}
                />
              </div>
            ))
          ) : (
            <span>Empty fridge</span>
          )}
        </div>
      </div>
      {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button>All</button>
          <button>My items</button>
        </div>

        {shoppingItems.map((item, index) => (
          <ShopItem key={index} item={item} />
        ))}
      </div> */}
      <span className="home-tittle-span">Shopping list</span>
      <div className="container-shopping-action">
        <button
          hidden={isModalOpen}
          className="btn-shopping"
          onClick={() => setIsModalOpen(true)}
        >
          Add item
        </button>
        <button
          hidden={isModalOpen}
          className="btn-shopping"
          onClick={() => saveShopping()}
        >
          Save shopping
        </button>

        <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>{' '}
      <div className="half-screen">
        <div className="items-content-flex">
          {shoppingItems.length > 0 ? (
            shoppingItems.map((item) => (
              <div key={item.Name} className="Item-flex">
                <ShopItem item={item} onTakeItem={() => takeItem(item.Name)} />
              </div>
            ))
          ) : (
            <span>Empty List</span>
          )}
        </div>
      </div>
      {/* <button className="logout-button" onClick={handleLogout}>
        Off
      </button> */}
    </div>
  )
}
Home.propTypes = {
  handleLogout: PropTypes.func.isRequired, // Validate that path is a string and required
}
export default Home
