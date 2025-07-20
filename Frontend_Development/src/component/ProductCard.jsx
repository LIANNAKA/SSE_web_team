import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Spinner, Alert, Form, Button } from "react-bootstrap";


const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/all");
        setProducts(response.data);

        const initialQuantities = {};
        response.data.forEach((prod) => {
          initialQuantities[prod.productId] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError("Failed to fetch products",err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const handleQuantityChange = (id, delta) => {
  setQuantities((prev) => {
    const newQty = Math.max(1, (prev[id] || 1) + delta);
    return {
      ...prev,
      [id]: newQty,
    };
  });
};


  const handleAddToCart = (product, quantity) => {
  setCart((prevCart) => {
    const existingItem = prevCart[product.productId];
    const updatedQuantity = existingItem ? existingItem.quantity + 1 : quantity;
    return {
      ...prevCart,
      [product.productId]: {
        ...product,
        quantity: updatedQuantity,
      },
    };
  });

  console.log("Cart:", cart);
};

const handleBuy = async (product) => {
  const quantity = quantities[product.productId];
  handleAddToCart(product, quantity);

  try {
    await axios.post(`http://localhost:5000/api/products/buy/${product.productId}`, {
      quantity
    });
    alert('Purchase Successful');
  } catch (err) {
    console.error('Purchase failed', err);
    alert('Purchase Failed');
  }
};


  const filteredProducts = products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.productId.toString().includes(searchTerm)
  );

  return (
    <div>
      {/* <Form.Control
        type="text"
        placeholder="Search by Name or ID"
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> */}

      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && filteredProducts.length === 0 && (
        <Alert variant="info">No products found.</Alert>
      )}

      <Row
        xs={2}
        sm={3}
        md={4}
        lg={5}
        className="px-3 gy-3 gx-3 gx-sm-3 gx-md-4 px-lg-4"
      >
        {!loading &&
          filteredProducts.map((prod) => (
            <Col key={prod.productId}>
              <Card
                className="h-100 shadow"
                style={{ width: "100%", maxWidth: "250px", margin: "0 auto" }}
              >
                <Card.Img
                className="ps-3 pe-0"
                variant="top"
                src={`http://localhost:5000${prod.imageUrl}`}
                alt={prod.name}
                style={{height: "150px" , width: "150px"}}
                onError={(e) => { e.target.src = '/default-product.png'; }}  // fallback optional
              />

                <Card.Body className="p-2 d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fs-6">{prod.name}</Card.Title>
                    <Card.Text
                      className="mb-1 text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Price: ₹{prod.price}
                    </Card.Text>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(prod.productId, -1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{quantities[prod.productId]}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(prod.productId, 1, true)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleBuy(prod)}
                  >
                    Buy
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ProductCard;