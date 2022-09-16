import { useState, useEffect } from "react";

const useFetchPeople = () => {
  const [people, setPeople] = useState([]);

  const fetchPeople = async ({ signal }) => {
    const people_list = [];
    const resp = await fetch("https://swapi.dev/api/people", { signal });

    const initialPeopleBatch = await resp.json();
    people_list.push(...initialPeopleBatch.results);

    let nextPage = initialPeopleBatch.next;
    while (nextPage) {
      const resp = await fetch(nextPage, { signal });

      const peopleBatch = await resp.json();
      people_list.push(...peopleBatch.results);
      nextPage = peopleBatch.next;
    }
    setPeople(people_list);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchPeople({ signal }).catch(() => console.log("aborted people fetch"));
    return () => controller.abort();
  }, []);

  return people;
};

export default useFetchPeople;
