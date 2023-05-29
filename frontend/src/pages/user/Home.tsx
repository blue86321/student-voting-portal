import React, { useEffect, useState, createContext } from "react";
import { Container } from "react-bootstrap";
import ElectionCard from "../../component/elections/ElectionCard";
// import { getElections } from "../../service/Api";
import Election from "../../model/Election.model";
import myApi from "../../service/MyApi";
import { ElectionDetail } from "../../Interfaces/Election";
import { currentUser } from "../../model/User.model";
// import {LoginResponse} from "../../service/MyApi"

function Home({ type }) {
  const [data, setData] = useState<Election[]>([]);
  const contentType = currentUser.isAdmin ? "admin" : type
  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await myApi.getElections();
      if (result.success) {
        const electionDetails = (result.data as ElectionDetail[]).map(election => {
          return new Election(election);
        });
        setData(electionDetails);
        // console.log("[Home] data:", electionDetails);
      } else {
        // Handle error
        console.log("[Home] getElections failed: " + result.msg);
      }
    };

    fetchDataAsync();
  }, [currentUser]);
  console.log("[Rendering] Home", contentType);

  const filterElections = (state, showCompletedOnly) => {
    const filteredData = data.filter(e => {
      const condition = e.state === state;
      return (showCompletedOnly && e.state !== 0) ? condition && e.isDataCompleted : condition
    })
    console.log("[Home] filterElections", filteredData)
    return filteredData
  }

  return (
    <div>
      <Container className="mt-4">
        {contentType === "onGoing" ? (
          <ElectionCard
            elections={filterElections(1,true)}
          ></ElectionCard>
        ) : contentType === "past" ? (
          <ElectionCard
            elections={filterElections(2,true)}
          ></ElectionCard>
        ) : contentType === "upComing" ? (
          <ElectionCard
            elections={filterElections(0,false)}
          ></ElectionCard>
        ) : contentType === "admin" ? (
          <ElectionCard elections={data.sort((a,b)=> a.state - b.state)}></ElectionCard>
        ) : null}
      </Container>
    </div>
  );
}

export default Home;
