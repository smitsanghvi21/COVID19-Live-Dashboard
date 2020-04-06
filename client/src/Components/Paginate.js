import React from "react";
import _ from "lodash";

export default function Paginate(props) {
  const { pageSize, dataCount, onPageChange, currentPage } = props;
  console.log("current page" + currentPage);
  const pagesCount = Math.ceil(dataCount / pageSize);
  let pages = [];
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }
  console.log("pages array" + pages);
  return (
    <div>
      <nav aria-label="...">
        <ul style={{ marginTop: "-16px" }} class="pagination">
          {pages.map((page) => {
            return (
              <li
                key={page}
                class={page === currentPage ? "page-item active" : "page-item"}
              >
                <a
                  class="page-link"
                  href="#"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
