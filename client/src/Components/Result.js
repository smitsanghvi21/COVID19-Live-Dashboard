import React from "react";
import Table from "react-bootstrap/Table";

const Result = (props) => {
  console.log("props value is:" + props.data);
  let { searchCheck, searchValue } = props;

  let update = props.data.map((item) => {
    const {
      countryInfo,
      country,
      cases,
      deaths,
      recovered,
      active,
      casesPerOneMillion,
    } = item;
    let findMortality = Math.ceil((deaths / cases) * 100);
    return searchCheck ? (
      country.toUpperCase().includes(searchValue.toUpperCase()) ? (
        <tbody>
          <tr key={countryInfo._id}>
            <td>
              <img
                style={{ height: "25px", width: "50px" }}
                src={countryInfo.flag}
              />
            </td>
            <td>{country}</td>
            <td>{cases}</td>
            <td>{active}</td>
            <td>{recovered}</td>
            <th>{findMortality}%</th>
            <td>{deaths}</td>
          </tr>
        </tbody>
      ) : (
        ""
      )
    ) : (
      <tbody>
        <tr key={countryInfo._id}>
          <td>
            <img
              style={{ height: "25px", width: "50px" }}
              src={countryInfo.flag}
            />
          </td>
          <td>{country}</td>
          <td>{cases}</td>
          <td>{active}</td>
          <td>{recovered}</td>
          <th>{findMortality}%</th>
          <td>{deaths}</td>
        </tr>
      </tbody>
    );
  });
  return (
    <div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Flag</th>
            <th>Country</th>
            <th>Cases</th>
            <th>Active</th>
            <th>Recovered</th>
            <th>Mortality</th>
            <th>Deaths</th>
          </tr>
        </thead>
        {update}
      </Table>
    </div>
  );
};
export default Result;
