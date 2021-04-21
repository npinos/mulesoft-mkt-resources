import React, { Component } from 'react'
import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider, RefinementListFilter, Pagination,
  HitsStats, SortingSelector, NoHits,
  ResetFilters, ViewSwitcherHits,
  SearchBox, GroupedSelectedFilters,
  Layout, LayoutBody, LayoutResults } from 'searchkit'
import './index.css';  


const host = "https://271457c113ad4edd831f7f16e895c271.us-west-1.aws.found.io:9243/resources"
const searchkit = new SearchkitManager(host, {
  basicAuth:"elastic:x92Io9XaxSag8x9pXK6GA470"
});

const linkLabels = {Webinar:'Watch webinar', Whitepaper:'Download whitepaper', eBook: 'Download eBook', Report:'Read report', Infographic:'See infographic', Demo: 'Watch demo'}

const ResourceListItem = (props)=> {
  const {bemBlocks, result} = props
  const source = extend({}, result._source)
  let resUrl = '';
  return (
    <a className="component-tile component-tile--view-mode-d bricks-component-edit-control-container" href={source.path} target="_blank">
      <h3 className="field">{source.title}</h3>
      <Summary fields={source} />
      <span className="arrow-button field">{linkLabels[source.type]}</span>
    </a>
  )
}

function Summary(props) {
  const hasSummary = props.fields.summary;
  if(hasSummary) {
    return <p className="field">{props.fields.summary}</p>
  }
  return <p className="field">{props.fields.subTitle} </p>
}

class App extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <LayoutBody>
            <section className="controls">
              <SearchBox
                  searchOnChange={true}
                  queryOptions={{analyzer:"standard"}}
                  prefixQueryFields={["title", "summary"]}
                  />
              <div className="filters-wrapper">
                <div className="filters-trigger" onClick={()=>{ document.getElementsByClassName('filters-wrapper')[0].classList.toggle('active'); document.getElementById('filters-bg').classList.toggle('active');}}>
                  <span href="#">Filter</span>
                </div>
                <div id="filters" className="filters-container">
                  <div className="filters-header">
                    <ResetFilters translations={{"reset.clear_all":"Clear all"}}/>
                    <HitsStats translations={{
                        "hitstats.results_found":"{hitCount} results found"
                      }}/>
                    <div className="close-filters-container" onClick={()=>{ document.getElementsByClassName('filters-wrapper')[0].classList.toggle('active'); document.getElementById('filters-bg').classList.toggle('active');}}>X</div>  
                  </div>
                  <div className="filters-input-container">
                    <RefinementListFilter id="initiatives" title="Initiative" field="initiatives.keyword" operator="OR"/>  
                    <RefinementListFilter id="industries" title="Industry" field="industries.keyword" operator="OR"/>
                    <RefinementListFilter id="technologies" title="Technology" field="technologies.keyword" operator="OR"/>
                    <RefinementListFilter id="type" title="Type" field="type.keyword" operator="OR"/>
                  </div>
                </div>
              </div>
              <div className="reset_main">
                  <ResetFilters translations={{"reset.clear_all":"Clear all"}}/>
              </div>
            </section>
            <section>
              <div className="facets-container">
                <GroupedSelectedFilters/>
              </div>
            </section>
            <LayoutResults className="no-padding-top-region">
              <div className="row-wrapper">
                <div className="row grid-x grid-margin-x">
                  <div className="small-12 medium-12 medium-offset-0 cell">
                    <div className="MS_SortingSelector">
                      <SortingSelector options={[
                        {label:"Newest", field:"created", order: "desc", defaultOption: true},
                        {label:"Oldest", field:"created", order: "asc", defaultOption: false}
                      ]} />
                    </div>
                    <ViewSwitcherHits
                      hitsPerPage={9999}
                      sourceFilter={["type", "path", "title", "summary", "subTitle", "created"]}
                      hitComponents={[
                        {key:"list", title:"List", itemComponent:ResourceListItem}
                      ]}
                    />
                  </div>
                </div>
              </div>
              <NoHits suggestionsField={"title"}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
