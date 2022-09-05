import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import useFetchPeople from "./hooks/useFetchPeople";
import useFetchHomeworldMapping from "./hooks/useFetchHomeworldMapping";

const PeopleList = () => {
  // would typically store these values in redux once fetched,
  // but storing in useState hook b/c of time constraint
  const people = useFetchPeople();
  const homeworldURLtoHomeworldMapping = useFetchHomeworldMapping(people);
  const [inputText, setInputText] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);

  const homeWorldOptionList = [{ value: "", label: "None" }];
  homeworldURLtoHomeworldMapping.forEach((key, value) => {
    homeWorldOptionList.push({ value: value, label: key });
  });

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    let filteredPeople = [...people];

    if (filterValue) {
      filteredPeople = filteredPeople.filter(
        (person) => person.homeworld === filterValue
      );
    }

    if (inputText) {
      filteredPeople = filteredPeople.filter((person) =>
        person.name.toLowerCase().includes(inputText)
      );
    }

    setFilteredPeople(filteredPeople);
  }, [filterValue, inputText]);

  let peopleList;

  if (filterValue || inputText) {
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
      <div>
        <input
          type="text"
          placeholder="Name"
          value={inputText}
          onChange={inputHandler}
        />
      </div>
      {peopleList}
    </div>
  );
};

export default PeopleList;
