import { useEffect, useState } from 'react';
import { Item, fetchItems, deleteItem } from '~/api';

const PLACEHOLDER_IMAGE = import.meta.env.VITE_FRONTEND_URL + '/logo192.png';
const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

interface Prop {
  reload: boolean;
  onLoadCompleted: () => void;
}

export const ItemList = ({ reload, onLoadCompleted }: Prop) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get Item[] type of data from server
        // wait until fetchItem gets data 
        const data = await fetchItems();
        console.debug('Fetched data structure:', JSON.stringify(data, null, 2));
        console.debug('First item example:', data);
        if (Array.isArray(data)) {
          // debug 
          console.log("First item:", data[0]);
          console.log("First item ID:", data[0].id);
          console.log("First item ID type:", typeof data[0].id);
        }
        setItems(data || []);
        onLoadCompleted();
      } catch (error) {
        console.error('GET error:', error);
      }
    };

    if (reload) {
      fetchData();
    }
  }, [reload, onLoadCompleted]);

  // show item details when user click the image 
  const showItemDetails = (item: Item) => {
    setSelectedItem(item);
  };

  // close the item details 
  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  // delete item from item list
  const handleDeleteItem = async (id: number | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // confirm if id exists
    if (id === undefined) {
      console.error('Cannot delete item with undefined ID');
      alert('IDが見つからないため、この商品を削除できません。');
      return;
    }
    
    if (window.confirm('この商品を削除してもよろしいですか？')) {
      try {
        const success = await deleteItem(id);
        
        if(success){
          setItems(prevItems => prevItems.filter(item => item.id !== id));
          
          if (selectedItem && selectedItem.id === id) {
            closeItemDetails();
          }
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('商品の削除に失敗しました。');
      }
    }
  };

  return (
    <div> 
      <div style={{ /* grid */ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',   // Create a 3-column grid with equal width (each column takes up 1fr)
        gap: '20px',                             // Set a 20px gap between grid items
        padding: '20px'                          // Add 20px padding inside the container
      }}>
        {items.map((item, index) => {
          const imageUrl = item.image
            ? `${SERVER_URL}/images/${item.image}`          // when item.image exists, set the image url
            : PLACEHOLDER_IMAGE;                            // when item.image is null or undefined, set the mercari default image
          const itemKey = item.id != null ? item.id : index;

          return (
            <div 
              key={itemKey} 
              className="ItemList"
              style={{
                border: '1px solid #ddd',                   // set the border to a light gray(#ddd)
                borderRadius: '8px',                        // rounded corners 
                overflow: 'hidden',                         // hide child elements if they overflow
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',   
                cursor: 'pointer',                          // indicate clickable
                transition: 'transform 0.3s ease',          // For mouse hover animation
                padding: '10px',                            // Inner margin
                textAlign: 'center',                        // center text
                position: 'relative'                        // To use as the reference point for absolute positioning of child elements
              }}
            >
              {/* delet button in the top left */}
              {item.id !== undefined && (
                <button 
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  style={{
                    position: 'absolute',                 // Absolute positioning based on the relative property of the parent element (item)
                    top: '5px',   
                    left: '5px',  
                    backgroundColor: 'rgba(255, 0, 0, 0.7)', // Semi-transparent red background color
                    color: 'white',                       // Change button text color to white
                    border: 'none',                       // No border 
                    borderRadius: '50%',                  // make it circular
                    width: '20px',                        // Button size (20px x 20px)
                    height: '20px',   
                    display: 'flex',  
                    alignItems: 'center',                 // Center text (x)
                    justifyContent: 'center',   
                    fontSize: '12px',                     // Button text size
                    padding: '0',                         // No margin
                    cursor: 'pointer',                    // Change cursor to pointer
                    zIndex: 10                            // Buttons come to the fron over other elements
                  }}
                >
                  ×
                </button>
              )}
              
              {/* Processing when clicking on a product */}
              <div
                onClick={() => showItemDetails(item)}
                style={{ width: '100%', height: '100%' }} // 
              >
                <img  // image settings
                  src={imageUrl} 
                  alt={item.name}
                  className="item-image"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px'  
                  }}
                  onError={(e) => {
                    console.log('Image load error for:', imageUrl);
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div style={{ padding: '10px' }}> 
                  <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{item.name}</p>
                  <p style={{ color: '#666', margin: '5px 0' }}>{item.category}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div>No items found. Please check your server connection.</div>
      )}

      {selectedItem && (
        <div style={{
          position: 'fixed', 
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',    // Expand to full screen
          display: 'flex',  
          justifyContent: 'center',
          alignItems: 'center',                       // Center the modal content
          zIndex: 1000                                // Display in front of other elements
        }}>
          <div style={{
            backgroundColor: 'white',  
            padding: '20px',              // inner margin
            borderRadius: '8px',          // Rounded Corners
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',             // enable scrolling
            position: 'relative',         // use as the reference point for positioining the close button
            textAlign: 'center'
          }}>
            <button 
              onClick={closeItemDetails}  // when user click, close the modal
              style={{
                position: 'absolute', 
                top: '10px',      
                right: '10px',            //  placed at the top right of the modal
                background: 'none',       // to make it simple with no background or border 
                border: 'none',     
                fontSize: '24px',
                cursor: 'pointer' 
              }}
            >
              &times;
            </button>
            <img 
              src={selectedItem.image ? `${SERVER_URL}/images/${selectedItem.image}` : PLACEHOLDER_IMAGE} // if image exists, get server url
              alt={selectedItem.name}   // alternative text when image is not displayed
              style={{
                width: '100%', 
                maxHeight: '300px',     // Limit height to a maximum of 300px
                objectFit: 'contain',   // maintain the image ratio fit it within the frame
                marginBottom: '20px'    // Leave a margin below to create space between the text
              }}
            />
            <h2 style={{ margin: '10px 0' }}>{selectedItem.name}</h2>  
            <p style={{ fontSize: '18px', color: '#666' }}>カテゴリー: {selectedItem.category}</p>
            {selectedItem.id && (
              <p style={{ fontSize: '14px', color: '#888' }}>商品ID: {selectedItem.id}</p>
            )}
          </div>  
        </div>
      )}
    </div>
  );
};