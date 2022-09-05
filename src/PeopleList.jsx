import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import useFetchPeople from "./hooks/useFetchPeople";
import useFetchHomeworldMapping from "./hooks/useFetchHomeworldMapping";

const PeopleList = () => {
  // would typically store these values in redux once fetched,
  // but storing in useState hook b/c of time constraint
  const people = useFetchPeople();
  const homeworldURLtoHomeworldMapping = useFetchHomeworldMapping(people);
  const [filterValue, setFilterValue] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);

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
