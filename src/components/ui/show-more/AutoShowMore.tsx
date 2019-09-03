import * as React from "react";
import * as ReactDOM from "react-dom";

import { ShowMoreProps } from './ShowMoreProps'

var containmentPropType = React.PropTypes.any;

if (typeof window !== 'undefined') {
  containmentPropType = React.PropTypes.instanceOf(Element);
}

// Temp clone from https://github.com/joshwnj/react-visibility-sensor/blob/master/visibility-sensor.js for testing purpose
export class VisibilitySensor extends React.Component<any, {
  isVisible: boolean,
  visibilityRect: Object
}>{
  interval: any
  
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool,
    partialVisibility: React.PropTypes.bool,
    delay: React.PropTypes.number,
    containment: containmentPropType,
    children: React.PropTypes.element
  }
  
  static defaultProps = {
    active: true,
    partialVisibility: false,
    delay: 1000,
    containment: null,
    children: React.createElement('span')
  }
  
  constructor(props){
    super(props)
    
    this.state = {
      isVisible: null,
      visibilityRect: {}
    }
  }

  componentDidMount() {
    if (this.props.active) {
      this.startWatching();
    }
  }

  componentWillUnmount() {
    this.stopWatching();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.setState({
        isVisible: null,
        visibilityRect: {}
      });
      this.startWatching();
    } else {
      this.stopWatching();
    }
  }

  startWatching() {
    if (this.interval) { return; }
    this.interval = setInterval(() => this.check(), this.props.delay);
    this.check();
  }

  stopWatching() {
    this.interval = clearInterval(this.interval);
  }

  /**
   * Check if the element is within the visible viewport
   */
  check() {
    var el = ReactDOM.findDOMNode(this);
    var rect = el.getBoundingClientRect();
    var containmentRect;

    if (this.props.containment) {
      containmentRect = this.props.containment.getBoundingClientRect();
    } else {
      containmentRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
      };
    }

    var visibilityRect = {
      top: rect.top >= containmentRect.top,
      left: rect.left >= containmentRect.left,
      bottom: rect.bottom <= containmentRect.bottom,
      right: rect.right <= containmentRect.right
    };

    var fullVisible = (
        visibilityRect.top &&
        visibilityRect.left &&
        visibilityRect.bottom &&
        visibilityRect.right
    );

    var partialVertical =
        (rect.top >= containmentRect.top && rect.top <= containmentRect.bottom)
     || (rect.bottom >= containmentRect.top && rect.bottom <= containmentRect.bottom);

    var partialHorizontal =
        (rect.left >= containmentRect.left && rect.left <= containmentRect.right)
     || (rect.right >= containmentRect.left && rect.right <= containmentRect.right);

    var partialVisible = partialVertical && partialHorizontal;

    var isVisible = this.props.partialVisibility
      ? partialVisible
      : fullVisible;

    var state = this.state
    // notify the parent when the value changes
    if (this.state.isVisible !== isVisible) {
      state = {
        isVisible: isVisible,
        visibilityRect: visibilityRect
      };
      this.setState(state);
      this.props.onChange(isVisible, visibilityRect);
    }

    return state;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}


export class AutoShowMore extends React.Component<ShowMoreProps, {}> {
  
  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)
  }
  
  onChange(isVisible){
    if (isVisible) this.props.onShowMore()
  }
  
  render(){
    const { hasMore, isLoading } = this.props
    if (!hasMore || isLoading) return null

    return (
      <VisibilitySensor onChange={this.onChange} delay={500} />
    );
  }
}
