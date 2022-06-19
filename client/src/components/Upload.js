import styled from "styled-components";

function Upload() {
  const DragBox = styled.div`
    display: flex;
    flex-direction: column;
    border: solid black 1px;
    width: 80%;
    height: 300px;
    margin: auto;
  `;

  const Text = styled.p`
    display: flex;
    justify-content: center;
    text-align: center;
    justify-content: center;
  `;

  return (
    <div>
      <DragBox>
        <Text>Drag your photos into the box below!</Text>
        <button
          onClick={null}
          style={{
            margin: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Upload
        </button>
      </DragBox>
    </div>
  );
}

export default Upload;
