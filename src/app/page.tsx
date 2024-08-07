"use client";

import axios from "axios";
import React, { use, useState } from "react";
import { cleanUser } from "@/libs/cleanUser";
import { useEffect } from "react";
import UserCard from "@/components/UserCard";
import { UserCardProps } from "@/libs/types";

export default function RandomUserPage() {
  // annotate type for users state variable
  const [users, setUsers] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if(isFirstLoad){
      setIsFirstLoad(false);
      return;
    }
    const jsonstr = JSON.stringify(genAmount);
    localStorage.setItem("users",jsonstr);
  },[genAmount]);

  useEffect(() => {
    const jsonstr = localStorage.getItem("users");
    if(jsonstr !== null){
      const newAmount = JSON.parse(jsonstr);
      setGenAmount(newAmount);
    }
  },[]);
  
  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)
    const cleanedUser = users.map((users : UserCardProps) => cleanUser(users));
    setUsers(cleanedUser);
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((users : UserCardProps) => { return <UserCard {...users}/>})}
    </div>
  );
}
