import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import PhotoAlbum from "./components/PhotoAlbum";
import Upload from "./components/Upload";

function App() {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    border: solid lightgray 1px;
    margin: 1rem auto;
    width: 90%;
    @media (max-width: 768px) {
      width: 95%;
    }
    @media (max-width: 425px) {
      width: 100%;
      margin: auto;
    }
  `;

  const Title = styled.h1`
    margin: 1rem;
    text-align: center;
  `;
  return (
    <>
      <Container>
        <Navbar />
        <Title>Photo album - Friends, Festivals, Dregs, Ballers</Title>
        <PhotoAlbum />
      </Container>

      <Routes>
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </>
  );
}

export default App;
