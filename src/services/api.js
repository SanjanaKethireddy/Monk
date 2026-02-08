const API_BASE_URL = 'https://stageapi.monkcommerce.app/task/products';
const API_KEY = '72njgfa948d9aS7gs5';

export const searchProducts = async (search = '', page = 0, limit = 10) => {
  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/search?${params}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fallback mock data for development without API key
export const getMockProducts = (search = '', page = 0, limit = 10) => {
  const allProducts = [
    {
      id: 77,
      title: "Fog Linen Chambray Towel - Beige Stripe",
      variants: [
        { id: 1, product_id: 77, title: "XS / Silver", price: "49", inventory_quantity: 99 },
        { id: 2, product_id: 77, title: "S / Silver", price: "49", inventory_quantity: 99 },
        { id: 3, product_id: 77, title: "M / Silver", price: "49", inventory_quantity: 99 }
      ],
      image: {
        id: 266,
        product_id: 77,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 80,
      title: "Orbit Terrarium - Large",
      variants: [
        { id: 64, product_id: 80, title: "Default Title", price: "109", inventory_quantity: 75 }
      ],
      image: {
        id: 272,
        product_id: 80,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 81,
      title: "Long Socks - Made with natural materials",
      variants: [
        { id: 65, product_id: 81, title: "S/ White / Cotton", price: "3.99", inventory_quantity: 99 },
        { id: 66, product_id: 81, title: "M/ White / Cotton", price: "3.99", inventory_quantity: 99 },
        { id: 67, product_id: 81, title: "L/ White / Cotton", price: "3.99", inventory_quantity: 99 },
        { id: 68, product_id: 81, title: "S/ White / Cotton", price: "3.99", inventory_quantity: 99 },
        { id: 69, product_id: 81, title: "M/ White / Cotton", price: "3.99", inventory_quantity: 60 }
      ],
      image: {
        id: 273,
        product_id: 81,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/81/images/273/702642-0005-1-nb.1729752195.386.513.jpg?c=1"
      }
    },
    {
      id: 82,
      title: "Printed Tshirt",
      variants: [
        { id: 70, product_id: 82, title: "S/ White / Cotton", price: "8.99", inventory_quantity: 75 }
      ],
      image: {
        id: 274,
        product_id: 82,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/82/images/274/printed-tshirt.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 83,
      title: "Cotton Classic Sneaker",
      variants: [
        { id: 71, product_id: 83, title: "Size 8", price: "59.99", inventory_quantity: 45 },
        { id: 72, product_id: 83, title: "Size 9", price: "59.99", inventory_quantity: 50 },
        { id: 73, product_id: 83, title: "Size 10", price: "59.99", inventory_quantity: 35 }
      ],
      image: {
        id: 275,
        product_id: 83,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/83/images/275/cotton-sneaker.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 84,
      title: "Leather Wallet - Brown",
      variants: [
        { id: 74, product_id: 84, title: "Standard", price: "45.00", inventory_quantity: 120 }
      ],
      image: {
        id: 276,
        product_id: 84,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/84/images/276/leather-wallet.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 85,
      title: "Denim Jacket - Vintage Blue",
      variants: [
        { id: 75, product_id: 85, title: "Small", price: "89.99", inventory_quantity: 25 },
        { id: 76, product_id: 85, title: "Medium", price: "89.99", inventory_quantity: 30 },
        { id: 77, product_id: 85, title: "Large", price: "89.99", inventory_quantity: 20 },
        { id: 78, product_id: 85, title: "XL", price: "89.99", inventory_quantity: 15 }
      ],
      image: {
        id: 277,
        product_id: 85,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/85/images/277/denim-jacket.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 86,
      title: "Ceramic Coffee Mug",
      variants: [
        { id: 79, product_id: 86, title: "White", price: "15.00", inventory_quantity: 200 },
        { id: 80, product_id: 86, title: "Black", price: "15.00", inventory_quantity: 180 }
      ],
      image: {
        id: 278,
        product_id: 86,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/86/images/278/ceramic-mug.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 87,
      title: "Wireless Earbuds Pro",
      variants: [
        { id: 81, product_id: 87, title: "Black", price: "149.99", inventory_quantity: 50 },
        { id: 82, product_id: 87, title: "White", price: "149.99", inventory_quantity: 45 }
      ],
      image: {
        id: 279,
        product_id: 87,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/87/images/279/wireless-earbuds.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 88,
      title: "Yoga Mat - Premium",
      variants: [
        { id: 83, product_id: 88, title: "Purple", price: "35.00", inventory_quantity: 80 },
        { id: 84, product_id: 88, title: "Blue", price: "35.00", inventory_quantity: 75 },
        { id: 85, product_id: 88, title: "Pink", price: "35.00", inventory_quantity: 60 }
      ],
      image: {
        id: 280,
        product_id: 88,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/88/images/280/yoga-mat.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 89,
      title: "Stainless Steel Water Bottle",
      variants: [
        { id: 86, product_id: 89, title: "500ml - Silver", price: "25.00", inventory_quantity: 150 },
        { id: 87, product_id: 89, title: "750ml - Silver", price: "30.00", inventory_quantity: 120 },
        { id: 88, product_id: 89, title: "1L - Silver", price: "35.00", inventory_quantity: 90 }
      ],
      image: {
        id: 281,
        product_id: 89,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/89/images/281/water-bottle.1647248662.386.513.jpg?c=1"
      }
    },
    {
      id: 90,
      title: "Canvas Backpack",
      variants: [
        { id: 89, product_id: 90, title: "Navy", price: "55.00", inventory_quantity: 40 },
        { id: 90, product_id: 90, title: "Olive", price: "55.00", inventory_quantity: 35 }
      ],
      image: {
        id: 282,
        product_id: 90,
        src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/90/images/282/canvas-backpack.1647248662.386.513.jpg?c=1"
      }
    }
  ];

  // Filter by search
  let filtered = allProducts;
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(searchLower)
    );
  }

  // Paginate
  const start = page * limit;
  const end = start + limit;
  return filtered.slice(start, end);
};
