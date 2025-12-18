import{ GoogleAuthProvider } from "firebase/auth";
import React , { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import AuthContext from "./AuthContexts";
import { auth } from "../firebase/Firebase.init";



const AuthProvider =({ children })=>{
    const [user, setUser]=useState(null);
    const [loading, setLoading]=useState(true);
    const createUser=(email, password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser=(email, password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const LogingOut=()=>{
        setLoading(true);
        return auth.signOut();
    }
    
    useEffect(()=>{
       const unsubscribe= auth.onAuthStateChanged(currentUser=>{
            setUser(currentUser);
            setLoading(false);
        });
        return()=>{
            unsubscribe();
        }
    },[]);

    const authInfo ={
        user,
        setUser,
        loading ,
        setLoading,
        LogingOut,  
        createUser,
        signInUser,
    };
    return (
        <AuthContext value={authInfo}>
            {children} </AuthContext>
    );
};
export default AuthProvider;