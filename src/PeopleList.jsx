import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";

const PeopleList = () => {
  const [people, setPeople] = useState([]);
  const [filterValue, setFilterValue] = useState("");
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
    let homeworldList = [];
    people?.forEach((person) => {
      if (!homeworldList.includes(person.homeworld)) {
        homeworldList.push(person.homeworld);
      }
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

  return (
    <div>
      <h2>Person | Home-world are listed below</h2>
      <ul>
        <Dropdown
          label="Filter by home-world: "
          options={homeWorldOptionList}
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
        />
        {people?.map((person, i) => (
          <li key={i}>
            {person.name} |{" "}
            {homeworldURLtoHomeworldMapping.get(person.homeworld)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
