import React from "react";
import Image from "next/image";
import { Container } from "react-bootstrap";

const Home = () => {
  return (
    <div> 
        <>
          <Container>
            <h1 style={{textAlign: 'center', color: 'Teal'}}>ร้านค้ามงคล</h1>
            <Image
              src="/store.png"
              alt="Store"
              width={3000}
              height={2000}
            />
          </Container>
        </>
    </div>
  );
}

export default Home;