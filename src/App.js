import React, { Component } from 'react'
import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'
import { width } from 'window-size';

const host = "https://271457c113ad4edd831f7f16e895c271.us-west-1.aws.found.io:9243/resources/"
const searchkit = new SearchkitManager(host, {
  basicAuth:"elastic:x92Io9XaxSag8x9pXK6GA470"
});

const ResourceListItem = (props)=> {
  const {bemBlocks, result} = props
  const source = extend({}, result._source)
  let resUrl = '';
  return (
    <div style={{width: '30%', margin: '0 15px 15px 0', display: 'inline-block', minHeight: '320px'}} className="component-tile component-tile--view-mode-d bricks-component-edit-control-container">
      <h3 className="field">{source.title}</h3>
      <p className="field">{source.summary}</p>
      <a href={'https://mulesoftd8.www.msit.io' + source.path} target="_blank" className="arrow-button field">See more</a>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <LayoutBody>
            <section className="controls">
              <div className="filters-trigger">
                <a href="#" onClick={()=>{ document.getElementsByClassName('filters-trigger')[0].classList.toggle('active'); document.getElementById('filters-bg').classList.toggle('active');}}>Filter</a>
                <div id="filters" className="filters-container">
                  <div className="filters-header">
                    <ResetFilters translations={{"reset.clear_all":"Clear all"}}/>
                    <HitsStats translations={{
                        "hitstats.results_found":"{hitCount} results found"
                      }}/>
                    <div className="close-filters-container" onClick={()=>{ document.getElementsByClassName('filters-trigger')[0].classList.toggle('active'); document.getElementById('filters-bg').classList.toggle('active');}}>X</div>  
                  </div>
                  <div className="filters-input-container">
                    <RefinementListFilter id="initiatives" title="Initiative" field="initiatives.keyword" operator="OR"/>  
                    <RefinementListFilter id="industries" title="Industry" field="industries.keyword" operator="OR"/>
                    <RefinementListFilter id="technologies" title="Technology" field="technologies.keyword" operator="OR"/>
                  </div>
                </div>
              </div>
              <div className="facets-container">           
                <div className="reset_main">
                  <ResetFilters translations={{"reset.clear_all":"Clear all"}}/>
                </div>
                <GroupedSelectedFilters/>
              </div>
            </section>
            <LayoutResults className="no-padding-top-region">
              <div className="row-wrapper">
                <div className="row grid-x grid-margin-x">
                  <div className="small-10 small-offset-1 medium-12 medium-offset-0 cell">
                      <ViewSwitcherHits
                        sourceFilter={["type", "path", "industries", "title", "summary"]}
                        hitComponents={[
                          {key:"list", title:"List", itemComponent:ResourceListItem}
                        ]}
                        scrollTo="body"
                      />
                  </div>
                </div>
              </div>
              <NoHits suggestionsField={"type,title,path"}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
