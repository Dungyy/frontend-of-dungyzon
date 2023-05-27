import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";

const NavbarComponent = ({ isDarkMode, toggleDarkMode }) => (
  <Navbar
    color=""
    light={!isDarkMode}
    dark={isDarkMode}
    expand="md"
    className="mb-5"
    size="xl"
    fixed="top"
  >
    <NavbarBrand style={{ fontSize: "21px" }} href="/">
      DUNGYZON
    </NavbarBrand>
    <Nav className="ml-auto togglebutton" navbar>
      <NavItem>
        <NavLink href="#" onClick={toggleDarkMode}>
          {isDarkMode ? "💡 Light Mode" : "🌛 Dark Mode"}
        </NavLink>
      </NavItem>
    </Nav>
  </Navbar>
);

export default NavbarComponent;


// import React, { useState } from 'react';
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Navbar, Nav, NavItem, NavLink } from 'reactstrap';

// const NavbarComponent = ({ isDarkMode, toggleDarkMode }) => {
//   const [modal, setModal] = useState(false);

//   const toggleModal = () => setModal(!modal);

//   return (
//     <div>
//       <Navbar color="light" light expand="md">
//         {/* Your other Navbar content here */}
//         <Nav className="ml-auto" navbar>
//           <NavItem>
//             <NavLink onClick={toggleModal}>About App</NavLink>
//           </NavItem>
//         </Nav>
//       </Navbar>

//       <Modal isOpen={modal} toggle={toggleModal}>
//         <ModalHeader toggle={toggleModal}>About App</ModalHeader>
//         <ModalBody>
//           Dungyzon is the fastest Amazon product search engine AI ever created.
//           It's been developed with a focus on speed, accuracy, and user experience, ensuring you can find the products you need as quickly as possible.
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={toggleModal}>Close</Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// }

// export default NavbarComponent;
