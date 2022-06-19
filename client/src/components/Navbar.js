import styled from "styled-components";
import { NavLink } from "react-router-dom";

function Navbar() {
  const Nav = styled.nav`
    display: flex;
    background: whitesmoke;
    padding: 0.5rem;
  `;

  const NavItem = styled.div`
    display: flex;
    flex-direction: row;
    margin: auto 1rem;
  `;

  return (
    <>
      <Nav>
        {/* <NavLink to="/">Albums</NavLink> */}
        <NavLink to="/upload">Upload</NavLink>
      </Nav>
    </>
  );
}

export default Navbar;
