const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export interface Item {
  id: number;
  name: string;
  category: string;
  image: string;
}

export interface ItemListResponse {
  items: Item[];
}

export const fetchItems = async (): Promise<Item[]> => {   // change ItemListResponse to Item[]
  const response = await fetch(`${SERVER_URL}/items`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (response.status >= 400) {
    throw new Error('Failed to fetch items from the server');
  }
  return response.json();
};


export const deleteItem = async (id: number): Promise<boolean> => {
  // ID verification
  if (id === undefined || isNaN(id)) {
    console.error('Invalid item ID:', id);
    return false;
  }

  try { // send an HTTP request to the server
    const response = await fetch(`${SERVER_URL}/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Server returned error: ${response.status}`);
      return false;
    }
    
    // debug
    console.log(`Item with ID ${id} deleted successfully`);
    return true;
    
  } catch (error) {
    console.error('Error deleting item:', error);
    return false;
  }
};

export interface CreateItemInput {
  name: string;
  category: string;
  image: string | File;
}

export const postItem = async (input: CreateItemInput): Promise<Response> => {
  const data = new FormData();
  data.append('name', input.name);
  data.append('category', input.category);
  data.append('image', input.image);
  const response = await fetch(`${SERVER_URL}/items`, {
    method: 'POST',
    mode: 'cors',
    body: data,
  });

  if (response.status >= 400) {
    throw new Error('Failed to post item to the server');
  }

 

  return response;
};
