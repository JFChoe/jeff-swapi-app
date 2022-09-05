import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";

const PeopleList = () => {
  // would typically store these values in redux once fetched,
  // but storing in useState hook b/c of time constraint
  const [people, setPeople] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [homeworldURLtoHomeworldMapping, setHomeworldURLtoHomeworldMapping] =
    useState(new Map());
  const updateHomeworldMap = (k, v) => {
    setHomeworldURLtoHomeworldMapping(
      new Map(homeworldURLtoHomeworldMapping.set(k, v))
    );
  };

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

  const fetchHomeWorld = async (homeworldURL) => {
    const resp = await fetch(homeworldURL);
    const planet = await resp.json();
    updateHomeworldMap(homeworldURL, planet.name);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    let homeworldList = new Set();
    people?.forEach((person) => {
      homeworldList.add(person.homeworld);
    });
    homeworldList.forEach((homeworldUrl) => {
      if (!homeworldURLtoHomeworldMapping.has(homeworldUrl)) {
        fetchHomeWorld(homeworldUrl);
      }
    });
  }, [people]);

  const homeWorldOptionList = [{ value: "", label: "None" }];
  homeworldURLtoHomeworldMapping.forEach((key, value) => {
    homeWorldOptionList.push({ value: value, label: key });
  });

  useEffect(() => {
    const filteredPeople = [];
    people.forEach((person) => {
      if (person.homeworld === filterValue) {
        filteredPeople.push(person);
      }
    });
    setFilteredPeople(filteredPeople);
  }, [filterValue]);

  let peopleList;

  if (filterValue) {
    peopleList = (
      <ul>
        {filteredPeople.map((person, i) => (
          <li key={i}>
            {person.name} |{" "}
            {homeworldURLtoHomeworldMapping.get(person.homeworld)}
          </li>
        ))}
      </ul>
    );
  } else if (people.length !== 0) {
    peopleList = (
      <ul>
        {people.map((person, i) => (
          <li key={i}>
            {person.name} |{" "}
            {homeworldURLtoHomeworldMapping.get(person.homeworld)}
          </li>
        ))}
      </ul>
    );
  } else {
    peopleList = <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Person | Home-world are listed below</h2>
      <Dropdown
        label="Filter by home-world: "
        options={homeWorldOptionList}
        value={filterValue}
        onChange={(event) => setFilterValue(event.target.value)}
      />
      {peopleList}
    </div>
  );
};

export default PeopleList;
