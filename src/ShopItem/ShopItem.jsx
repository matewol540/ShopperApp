import './ShopItem.css'
import PropTypes from 'prop-types'

function ShopItem({ item, onAddItem, onDeleteItem, onRemoveItem, onTakeItem }) {
  return (
    <div className="item-container">
      <div className="item-image-counter">
        <div className="item-image-wrapper">
          <img
            className="item-image"
            src={item.imageUrl}
            style={{
              width: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        {item.Count > 0 ? (
          <span className="item-counter">{item.Count}</span>
        ) : null}
      </div>
      <div className="item-description-action">
        <div className="item-description">
          <div className="item-display-container ">
            <span>{item.Name}</span>
          </div>
        </div>
        <div className="item-description">
          <div className="item-display-container ">
            <span>{item.Taker}</span>
          </div>
        </div>
        {!onTakeItem ? (
          <div className="item-action">
            <button
              className="btn-action btn-action-left"
              onClick={() => onAddItem()}
            >
              +
            </button>
            <button
              className="btn-action btn-action-right"
              onClick={() => onDeleteItem()}
            >
              -
            </button>
            {/* <button
            className="btn-action btn-action-center"
            onClick={() => onRemoveItem()}
          >
            Remove
          </button> */}
          </div>
        ) : (
          <div className="item-action">
            <button
              className="btn-action btn-action-center"
              onClick={() => onTakeItem()}
            >
              Take
            </button>
            {/* <button
            className="btn-action btn-action-center"
            onClick={() => onRemoveItem()}
          >
            Remove
          </button> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopItem

ShopItem.propTypes = {
  item: PropTypes.any, // Validate that path is a string and required
  onAddItem: PropTypes.func, // Validate that path is a string and required
  onRemoveItem: PropTypes.func, // Validate that path is a string and required
  onDeleteItem: PropTypes.func, // Validate that path is a string and required
  onTakeItem: PropTypes.func, // Validate that path is a string and required
}
