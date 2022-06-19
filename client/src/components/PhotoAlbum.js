import { useEffect, useState } from "react";
import styled from "styled-components";

function PhotoAlbum() {
  const Album = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 0.5rem;
    align-items: center;
    width: 100%;
    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 425px) {
      grid-template-columns: 1fr;
    }
  `;

  const PhotoDiv = styled.div`
    border: solid lightgray 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* height: 100%; */
    width: auto;
  `;

  const [photos, setPhotos] = useState();

  useEffect(() => {
    fetch("https://api.pexels.com/v1/search?query=people", {
      headers: {
        Authorization:
          
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setPhotos(data.photos);
      });
  }, []);

  const renderPhotos = photos?.map((photo) => {
    return (
      <PhotoDiv>
        <img src={photo.src.small} alt={photo.alt} key={photo.id} />
        <p>
          <strong>Uploaded by:</strong> {photo.photographer} <br />
          <strong>Description:</strong> {photo.alt}
        </p>
      </PhotoDiv>
    );
  });

  return (
    <div>
      <h3>(Album Title)</h3>
      <Album>{renderPhotos}</Album>
    </div>
  );
}

export default PhotoAlbum;
