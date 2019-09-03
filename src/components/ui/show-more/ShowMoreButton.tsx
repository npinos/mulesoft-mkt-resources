import * as React from "react";
import { ShowMoreProps } from './ShowMoreProps'

export class ShowMoreButton extends React.Component<ShowMoreProps, {}> {
  onShowMore = (e: any): void => {
    this.props.onShowMore()
    e.preventDefault()
  }
  render(){
    const { onShowMore, hasMore, isLoading } = this.props

    if (!hasMore) return null
    return (
      <div className="sk-pagination-show-more">
        {isLoading
           ? <button className="sk-button" disabled={true}>Loading...</button>
           : <button className="sk-button" onClick={this.onShowMore}>Show More</button>
          }
      </div>
    );
  }
}
