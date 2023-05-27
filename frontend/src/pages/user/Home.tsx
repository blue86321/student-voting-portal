import React, { useEffect, useState, createContext } from "react";
import { Container } from "react-bootstrap";
import ElectionCard from "../../component/elections/ElectionCard";
// import { getElections } from "../../service/Api";
import Election from "../../model/Election.model";
import myApi from "../../service/MyApi";
import { ElectionDetail } from "../../Interfaces/Election";
// import {LoginResponse} from "../../service/MyApi"

function Home({ type }) {
  console.log("[Rendering] Home");
  const [data, setData] = useState<Election[]>([]);

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
  }, []);

  return (
    <div>
      <Container className="mt-4">
        {type === "onGoing" ? (
          <ElectionCard
            elections={data.filter((election) => election.state === 1)}
          ></ElectionCard>
        ) : type === "past" ? (
          <ElectionCard
            elections={data.filter((election) => election.state === 2)}
          ></ElectionCard>
        ) : type === "upComing" ? (
          <ElectionCard
            elections={data.filter((election) => election.state === 0)}
          ></ElectionCard>
        ) : type === "admin" ? (
          <ElectionCard elections={data}></ElectionCard>
        ) : null}
      </Container>
    </div>
  );
}

export default Home;
