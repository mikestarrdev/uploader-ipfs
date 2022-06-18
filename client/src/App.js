import styled from "styled-components";

function App() {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    border: solid lightgray 1px;
    margin: 1rem auto;
    width: 80%;
  `;

  const Title = styled.h1`
    margin: 1rem;
    text-align: center;
  `;
  return (
    <>
      <Container>
        <Title>Photo album - Friends, Festivals, Dregs, Ballers</Title>
      </Container>
    </>
  );
}

export default App;
