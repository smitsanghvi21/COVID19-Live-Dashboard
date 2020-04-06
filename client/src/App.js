import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Card from "./Components/Card";
import Loading from "./Components/Loading";
import Paginate from "./Components/Paginate";
import Result from "./Components/Result";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      totalData: [],
      searchText: "",
      searchResult: [],
      isSearch: false,
      isLoading: true,
      pageSize: 8,
      currentPage: 1,
      showPaginate: true,
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  //for displaying the data of all the countries
  componentDidMount() {
    const url = "https://corona.lmao.ninja/countries?sort=country";
    fetch(url)
      .then((result) => result.json())
      .then((result) => {
        //sorting by highest case
        var sortedData = result.sort((a, b) => b.cases - a.cases);
        this.setState({
          data: sortedData,
          isLoading: false,
        });
      });

    //for displaying data in the card component
    const totalUrl = "https://corona.lmao.ninja/all";
    fetch(totalUrl)
      .then((result) => result.json())
      .then((result) => {
        //let store=result;
        //console.log("store data"+store)
        this.setState({
          totalData: result,
        });
        console.log("2nd fetched data" + this.state.totalData);
      });
  }

  onSearchChange = (e) => {
    console.log("search change " + this.state.searchText);
    if (e.target.value === "") {
      this.setState({ searchText: e.target.value, isSearch: false });
    } else {
      this.setState({
        searchText: e.target.value,
        isSearch: true,
        showPaginate: false,
      });
    }
    console.log("api data" + this.state.data[0]);
  };

  handlePageChange = (page) => {
    this.setState({
      currentPage: page,
    });
  };
  render() {
    const indexOfLastItem = this.state.currentPage * this.state.pageSize;
    console.log("indexOfLastItem" + indexOfLastItem);
    const indexOfFirstItem = indexOfLastItem - this.state.pageSize;
    console.log("indexOfFirstItem" + indexOfFirstItem);
    const currentData = this.state.data.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    console.log("current data" + currentData);
    return this.state.isLoading ? (
      <Loading />
    ) : (
      <div id="main">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">
            <Button id="live_text">Live</Button>
            <img
              alt=""
              src="/logo.svg"
              width="100"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Covid-19 dashboard
          
            <span id="custom_text"> Made with <span id="custom_text2">❤</span> in New Zealand</span>

          </Navbar.Brand>
        </Navbar>

        <Card totalData={this.state.totalData} />

        <Form.Group>
          <Form.Control
            id="search_bar"
            value={this.state.searchText}
            onChange={this.onSearchChange}
            type="text"
            placeholder="Enter country"
          />
        </Form.Group>

        <Result
          data={this.state.isSearch ? this.state.data : currentData}
          searchCheck={this.state.isSearch}
          searchValue={this.state.searchText}
        />

        {!this.state.isSearch && (
          <Paginate
            dataCount={this.state.data.length}
            pageSize={this.state.pageSize}
            onPageChange={this.handlePageChange}
            currentPage={this.state.currentPage}
          />
        )}
      </div>
    );
  }
}
