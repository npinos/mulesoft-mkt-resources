import * as React from "react";
import { findDOMNode } from "react-dom";
import {mount} from "enzyme";
import {ShowMorePagination} from "./InfiniteScrollingPagination";
import {SearchkitManager, ImmutableQuery} from "../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../__test__/TestHelpers"
import * as sinon from "sinon";

describe("InfiniteScrollingPagination tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    this.searchkit.addDefaultQuery((query)=> {
      return query.setSize(10)
    })
    this.createWrapper = (props={}) => {
      this.wrapper = mount(
        <ShowMorePagination {...props} searchkit={this.searchkit} />
      );
      this.accessor = this.searchkit.accessors.statefulAccessors["p"]
    }

    this.searchkit.query = new ImmutableQuery().setSize(10)


    this.searchkit.setResults({
      hits:{
        total:80,
        hits: []
      }
    })
  });
  it("renders the button", () => {
    this.createWrapper()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-pagination-show-more">
        <button className="sk-button">Show More</button>
      </div>
    ))
  })
  
  it("handles click", ()=> {
    this.createWrapper()
    this.searchkit.performSearch()
    this.accessor.state = this.accessor.state.setValue(3)
    this.wrapper.update()
    this.wrapper.find(".sk-button").first().simulate("click")
    expect(this.accessor.state.getValue()).toBe(4)
  })
    
  it("removes the button when finished", () => {
    this.createWrapper()
    this.accessor.state = this.accessor.state.setValue(8);
    this.wrapper.update()
    expect(findDOMNode(this.wrapper.node)).toBe(null)
  })
});
