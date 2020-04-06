import React from "react";

export default function Card(props) {
  let { totalData } = props;
  //let displayTotal=totalData.map((item)=>{
  // const {cases, deaths, recovered, active, affectedCountries}=item

  return (
    <div style={{ display: "inline-flex", width: "100%", marginTop: "30px" }}>
      <div style={{ width: "20%" }} class="card text-white bg-primary mb-3">
        <div class="card-header">Total cases</div>
        <div class="card-body">{totalData.cases}</div>
      </div>
      <div style={{ width: "20%" }} class="card text-white bg-secondary mb-3">
        <div class="card-header">Active</div>
        <div class="card-body">{totalData.active}</div>
      </div>
      <div style={{ width: "20%" }} class="card text-white bg-success mb-3">
        <div class="card-header">Recovered</div>
        <div class="card-body">{totalData.recovered}</div>
      </div>
      <div style={{ width: "20%" }} class="card text-white bg-danger mb-3">
        <div class="card-header">Deaths</div>
        <div class="card-body">{totalData.deaths}</div>
      </div>
      <div style={{ width: "20%" }} class="card text-white bg-dark mb-3">
        <div class="card-header">Affected countries</div>
        <div class="card-body">{totalData.affectedCountries}</div>
      </div>
    </div>
  );
}
