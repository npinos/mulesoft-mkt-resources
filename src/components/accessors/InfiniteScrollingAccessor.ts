import {ValueState} from "searchkit"
import {StatefulAccessor} from "searchkit"


export class InfiniteScrollingAccessor extends StatefulAccessor<ValueState> {
  state = new ValueState(1)

  onStateChange(oldState={}){
    // Reset page scrolling on any state change
    this.state = this.state.clear()
  }
  
  fromQueryObject(ob){
    
  }
  
  getQueryObject(){
    return {}
  }

  buildOwnQuery(query){
    let from = (query.getSize() || 20) * (Number(this.state.getValue()) -1 )
    if(from > 0){
      return query.setFrom(from)
    }
    return query
  }
  
  postProcessQuery(query){
    if (Number(this.state.getValue()) > 1){
      return query.setShouldAppendResults(true).removeAggs()
    }
    return query
  }
}

export default InfiniteScrollingAccessor;
