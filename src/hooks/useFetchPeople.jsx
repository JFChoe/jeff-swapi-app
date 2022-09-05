import { useState, useEffect } from "react";

const useFetchPeople = () => {
  const [people, setPeople] = useState([]);

  const fetchPeople = async () => {
    const people_list = [];
    const resp = await fetch("https://swapi.dev/api/people");

    const initialPeopleBatch = await resp.json();
    people_list.push(...initialPeopleBatch.results);

    let nextPage = initialPeopleBatch.next;
    while (nextPage) {
      const resp = await fetch(nextPage);

      const peopleBatch = await resp.json();
      people_list.push(...peopleBatch.results);
      nextPage = peopleBatch.next;
    }
    setPeople(people_list);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return people;
};

export default useFetchPeople;
