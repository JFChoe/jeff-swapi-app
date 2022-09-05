import { useState, useEffect } from "react";

const useFetchHomeworldMapping = (people) => {
  const [homeworldURLtoHomeworldMapping, setHomeworldURLtoHomeworldMapping] =
    useState(new Map());
  const updateHomeworldMap = (k, v) => {
    setHomeworldURLtoHomeworldMapping(
      new Map(homeworldURLtoHomeworldMapping.set(k, v))
    );
  };

  const fetchHomeWorld = async (homeworldURL) => {
    const resp = await fetch(homeworldURL);
    const planet = await resp.json();
    updateHomeworldMap(homeworldURL, planet.name);
  };

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

  return homeworldURLtoHomeworldMapping;
};

export default useFetchHomeworldMapping;
