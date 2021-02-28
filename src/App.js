import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './FirebaseConfig/FireBaseConfig';
firebase.initializeApp(firebaseConfig);
function App() {
  const [newUser,setNewUser]=useState(false)
  const [user,setUser]=useState({
    isSigned:false,
    name:'',
  
    email:'',
    photo:'',
    password:''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn=()=>{
    firebase.auth()
  .signInWithPopup(provider)
  .then(res=>{
    const {displayName,email,photoURL}=res.user
    let signed={
      isSigned:true,
      name:displayName,
      email:email,
      photo:photoURL
    }
    setUser(signed)
    console.log(displayName,email,photoURL)
  })
  .catch(err=>console.log(err))
  }
  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(() => {
     let isSignedOut={
       isSigned:false,
  
       name:'',
       email:'',
       photo:'',
       error:'',
       success:false
     }
     setUser(isSignedOut)
    })
    .catch((error) => {
      console.log(error)
    });
  }

  const handleChange=(e)=>{
   
  
   let fieldValid=true;
    if(e.target.name==="email"){
       fieldValid=/\S+@\S+\.\S+/.test(e.target.value)

      
     
    }
    if(e.target.name==="password"){
      const isPasswordValid=e.target.value.length>6;
      
      const passwordNumber= /\d{1}/.test(e.target.value)
      fieldValid=isPasswordValid && passwordNumber


    }
    if(fieldValid){
      const newUser={...user}
      newUser[e.target.name]=e.target.value
      setUser(newUser)
    }
}
  

  const handleSubmit=(e)=>{
    e.preventDefault()
    if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res=>{
     let userInfo={...user}
      userInfo.error=''
      userInfo.success=true

      updateUserName(user.name)
      setUser(userInfo)
     

    })
 
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    let userInfo={...user}
    userInfo.error=errorMessage
    userInfo.success=false
    setUser(userInfo)
    console.log(errorCode,errorMessage)
    
  });
}

  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    let userInfo={...user}
      userInfo.error=''
      userInfo.success=true
      setUser(userInfo)
      console.log('sign in user-info',res.user)
    
   
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    let userInfo={...user}
    userInfo.error=errorMessage
    userInfo.success=false
    setUser(userInfo)
    console.log(errorCode,errorMessage)
   
  });

  }

  }
  
  const updateUserName=(name)=>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
     
    }).then(function() {
      console.log('updated success')
    }).catch(function(error) {
     console.log(error.message)
    });
  }

  return (
    <div className="App">
      {
        user.isSigned ? <button onClick={handleSignOut}>Sign Out</button>
        : <button onClick={handleSignIn}>Sign In</button>
      }
      <br/>
     <button>Sign In Using Facebook</button>
     {
       user.isSigned &&
       <div>
         <p>Welcome {user.name} </p>
         <p>Your Mail: {user.email}</p>
         <img src={user.photo} alt=""/>
       </div>
     }
     <br/>
  <h1>Our Authentication</h1>
   <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="userName"/>
   <label htmlFor="newuser">New-user-Sign-up</label>
     
     
     <form onSubmit={handleSubmit}>
       {newUser &&
       <input onChange={handleChange} name="name" type="text" placeholder="name"/>


}
       <br/>
       <input required name="email" onChange={handleChange}  placeholder="Your Email Address" type="email"/>
       <br/>
       <input  name="password" onChange={handleChange} placeholder="Your Password" type="password" required  />
       <br/>
       <input type="submit" value={newUser ? 'Sign-up' :'Sign-in'}/>
     </form>
     
     <p style={{color:'red'}}>{user.error}</p>
     
     {
       user.success && <p style={{color:'green'}}>user {newUser? "successfully": "logged in"} created</p>
     }
    </div>
    
  );
}

export default App;
