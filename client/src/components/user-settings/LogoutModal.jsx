import React, { useEffect, useState } from "react";

import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";


import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import {
    Route,
    BrowserRouter as Router,
    Routes,
    useNavigate,
} from "react-router-dom";

import { Login } from "/src/components/login/Login.tsx";

export default function LogoutModal({isOpen, onClose}) {
    const { role } = useRoleContext();
    const [userInfo] = useState();
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Logout</ModalHeader>
                <ModalBody>Are you sure you want to logout of {role}?</ModalBody>
                <ModalFooter>
                    <Button onClick={handleLogout}>LOGOUT</Button>
                    <Button onClick={onClose}>CANCEL</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
