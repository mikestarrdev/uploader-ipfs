import { useEffect, useState } from "react";
import styled from "styled-components";

function PhotoAlbum() {
  const Album = styled.div`
    display: flex;
    flex-direction: row;
    width: auto;
  `;

  const [photos, setPhotos] = useState();

  useEffect(() => {
    fetch("https://api.pexels.com/v1/search?query=people", {
      headers: {
        Authorization: "",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.photos);
        setPhotos(data.photos);
      });
  }, []);

  const renderPhotos = photos?.map((photo) => {
    return (
      <div>
        <img src={photo.src.small} alt={photo.alt} key={photo.id} />
      </div>
    );
  });

  return (
    <div>
      <h3>Photos</h3>
      <Album>{renderPhotos}</Album>
    </div>
  );
}

export default PhotoAlbum;
