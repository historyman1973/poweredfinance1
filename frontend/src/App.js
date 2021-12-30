import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import ClientCard from './components/ClientCard';

function App() {
  const [clientList, setClientList] = useState([])
  // const [loading, setLoading] = useState(true)

  const getClientList = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/client-list`);
      setClientList(res.data || []);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  useEffect(() => getClientList(), [])


  return (
    <div><Header title="Powered Finance"/>
    <Container>
    <Row xs={1} md={2} lg={3}>
              {clientList.map((client, i) => (
                <Col key={i} className="pb-3">
                  <ClientCard
                    client={client}
                  />
                </Col>
              ))}
            </Row>
    </Container>
    <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
