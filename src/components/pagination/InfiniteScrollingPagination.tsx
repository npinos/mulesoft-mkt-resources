import * as React from "react";

import {
  SearchkitComponent,
  SearchkitComponentProps,
  RenderComponentType,
  RenderComponentPropType,
  renderComponent
} from 'searchkit'

import InfiniteScrollingAccessor from "../accessors/InfiniteScrollingAccessor"

import {
  AutoShowMore,
  ShowMoreButton,
  ShowMoreProps
} from "../ui/show-more"

const defaults = require("lodash/defaults")
const get = require("lodash/get")

export interface InfiniteScrollingPaginationProps extends SearchkitComponentProps {
  showMoreComponent?: RenderComponentType<ShowMoreProps>
}

export class InfiniteScrollingPagination extends SearchkitComponent<InfiniteScrollingPaginationProps, any> {
  accessor:InfiniteScrollingAccessor

  static propTypes = defaults({
    showMoreComponent: React.PropTypes.any
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    showMoreComponent: AutoShowMore
  }

  constructor(props){
    super(props)

    this.showMoreIfNeeded = this.showMoreIfNeeded.bind(this)
  }

  defineAccessor() {
    return new InfiniteScrollingAccessor("p")
  }

  getCurrentPage():number {
    return Number(this.accessor.state.getValue()) || 1;
  }

  getTotalPages():number {
    return Math.ceil(
      get(this.getResults(), "hits.total", 1)
      /
      get(this.getQuery(), "query.size", 10)
    );
  }

  hasMore(){
    return this.hasHits() && this.getTotalPages() > this.getCurrentPage()
  }

  showMoreIfNeeded() {
    if (this.searchkit.loading || !this.hasMore()) return;

    this.accessor.state = this.accessor.state.setValue(this.getCurrentPage() + 1);
    this.searchkit.performSearch();
  }

  render() {
    const { showMoreComponent } = this.props
    return renderComponent(showMoreComponent, {
      page: this.getCurrentPage(),
      totalPages: this.getTotalPages(),
      hasMore: this.hasMore(),
      isLoading: this.searchkit.loading,
      onShowMore: this.showMoreIfNeeded
    })
  }
}

export class ShowMorePagination extends InfiniteScrollingPagination {
    static defaultProps = defaults({
        showMoreComponent: ShowMoreButton,
    }, InfiniteScrollingPagination.defaultProps)
}
