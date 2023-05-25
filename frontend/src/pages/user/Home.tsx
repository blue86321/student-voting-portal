import React, { useEffect, useState, createContext } from "react";
import { Container } from "react-bootstrap";
import ElectionCard from "../../component/elections/ElectionCard";
import { fetchElections } from "../../service/Api";
import Election from "../../model/Election.model";

function Home({ type }) {
  const [data, setData] = useState<Election[]>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result: Election[] = await fetchElections();
        const instances = result.map(
          (item) =>
            { console.log('[Home] item: ', item)
              const e = new Election(
              item.election_name,
              item.desc,
              item.start_time,
              item.end_time,
              item.id,
              item.url,
            )
             console.log('[Home] election: ', e)
            return e
          }
        );
        setData(instances);
        console.log("[Election card] data:", instances);
      } catch (error) {
        // Handle error
      }
    };

    fetchDataAsync();
  }, []);

  console.log("[Home]:", data);

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
        ) : null}
      </Container>
    </div>
  );
}

export default Home;
