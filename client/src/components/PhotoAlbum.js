import { useEffect, useState } from "react";
import styled from "styled-components";

function PhotoAlbum() {
  const Album = styled.div`
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    align-items: center;
    width: auto;
    margin: auto;
    padding: 1rem;
  `;

  const Photo = styled.div`
    border: solid lightgray 2px;
    align-items: center;
    justify-content: center;
    margin: 0.1rem;
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
      <Photo>
        <img src={photo.src.small} alt={photo.alt} key={photo.id} />
        <p>
          <strong>Uploaded by:</strong> {photo.photographer} <br />
          <strong>Description:</strong> {photo.alt}
        </p>
      </Photo>
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
